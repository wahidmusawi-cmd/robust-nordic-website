import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/admin/stripe"


// ─── Order confirmation email (Resend) ──────────────────────────────────
// Silently skipped until RESEND_API_KEY is configured.
async function sendOrderConfirmation(params: {
  to: string
  customerName: string | null
  lineItems: { description: string | null; amount_total: number; currency: string }[]
  total: number
  currency: string
  locale: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const { to, customerName, lineItems, total, currency, locale } = params

  const greeting =
    locale === "sv" ? "Tack för din beställning!" :
    locale === "en" ? "Thank you for your order!" :
    "Kiitos tilauksestasi!"

  const bodyText =
    locale === "sv" ? "Din beställning är bekräftad och vi förbereder din leverans." :
    locale === "en" ? "Your order is confirmed and we are preparing your shipment." :
    "Tilauksesi on vastaanotettu ja valmistelemme lähetystäsi."

  const totalLabel =
    locale === "sv" ? "Totalt" : locale === "en" ? "Total" : "Yhteensä"

  const supportLabel =
    locale === "sv" ? "Frågor? Kontakta oss på" :
    locale === "en" ? "Questions? Reach us at" :
    "Kysymyksiä? Tavoitat meidät osoitteesta"

  const fmt = (cents: number, cur: string) =>
    `${(cents / 100).toFixed(2).replace(".", ",")} ${cur.toUpperCase()}`

  const itemsHtml = lineItems.map((li) => `
    <tr>
      <td style="padding:14px 18px;color:#0d3d66;font-size:14px;border-bottom:1px solid #ddd6d3">${li.description ?? ""}</td>
      <td style="padding:14px 18px;text-align:right;color:#0d3d66;font-weight:500;font-size:14px;border-bottom:1px solid #ddd6d3">${fmt(li.amount_total, li.currency)}</td>
    </tr>`).join("")

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e8e8;padding:32px 16px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">

        <!-- Header -->
        <tr>
          <td style="background:#0d3d66;padding:28px 32px;text-align:center">
            <img src="https://robustnordic.fi/brand/robust-logo-white.png" alt="Robust Nordic" height="36" style="display:block;margin:0 auto;max-width:200px">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fbfaf8;padding:36px 32px">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:500;color:#0d3d66">${greeting}</h1>
            ${customerName ? `<p style="margin:0 0 4px;color:#5a6b7d;font-size:14px">Hei ${customerName},</p>` : ""}
            <p style="margin:0 0 28px;color:#5a6b7d;font-size:14px">${bodyText}</p>

            <!-- Order table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;border:1px solid #ddd6d3;overflow:hidden;margin-bottom:24px">
              ${itemsHtml}
              <tr style="background:#f0f3f8">
                <td style="padding:14px 18px;color:#0d3d66;font-weight:500;font-size:14px">${totalLabel}</td>
                <td style="padding:14px 18px;text-align:right;color:#0d3d66;font-weight:500;font-size:14px">${fmt(total, currency)}</td>
              </tr>
            </table>

            <!-- Support -->
            <div style="border-top:1px solid #ddd6d3;padding-top:20px;text-align:center">
              <p style="margin:0 0 4px;color:#5a6b7d;font-size:12px">${supportLabel}</p>
              <a href="mailto:asiakaspalvelu@robustnordic.fi" style="color:#6590b2;font-size:12px;text-decoration:none">asiakaspalvelu@robustnordic.fi</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d3d66;padding:16px 32px;text-align:center">
            <p style="margin:0;color:#6590b2;font-size:11px">© ${new Date().getFullYear()} Robust Nordic · robustnordic.fi</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Robust Nordic <tilaukset@robustnordic.fi>",
        to,
        subject: greeting,
        html,
      }),
    })
    if (!res.ok) console.error("Resend error:", res.status, await res.text())
  } catch (err) {
    console.error("Email send error:", err)
  }
}

export async function POST(req: NextRequest) {
  // Lazy init so a missing key fails the request, not the whole build.
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error"
    console.error("Webhook signature verification failed:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      console.log("Payment completed:", session.id, session.metadata)

      const email = session.customer_details?.email
      // Webhook payloads don't include line items — fetch them.
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      })
      const lineItems = (full.line_items?.data ?? []).map((li) => ({
        description: li.description,
        amount_total: li.amount_total ?? 0,
        currency: li.currency,
      }))

      // Send confirmation to customer
      if (email) {
        await sendOrderConfirmation({
          to: email,
          customerName: session.customer_details?.name ?? null,
          lineItems,
          total: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          locale: session.metadata?.locale ?? "fi",
        })
      }

      // Send admin notification
      await sendOrderConfirmation({
        to: "asiakaspalvelu@robustnordic.fi",
        customerName: session.customer_details?.name ?? null,
        lineItems,
        total: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        locale: "fi",
      })
      break
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent
      console.error("Payment failed:", pi.id)
      break
    }
    default:
      console.log("Unhandled event type:", event.type)
  }

  return NextResponse.json({ received: true })
}
