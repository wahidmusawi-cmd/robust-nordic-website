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

  const fmt = (cents: number, cur: string) =>
    `${(cents / 100).toFixed(2).replace(".", ",")} ${cur.toUpperCase()}`

  const itemsHtml = lineItems
    .map(
      (li) =>
        `<tr><td style="padding:8px 0;color:#555">${li.description ?? ""}</td>` +
        `<td style="padding:8px 0;text-align:right;color:#111;font-weight:600">${fmt(li.amount_total, li.currency)}</td></tr>`,
    )
    .join("")

  const html = `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
    <h1 style="font-size:24px;color:#111;margin-bottom:8px">${greeting}</h1>
    ${customerName ? `<p style="color:#555">Hei ${customerName},</p>` : ""}
    <p style="color:#555;margin-bottom:24px">
      ${locale === "sv" ? "Din beställning är bekräftad och vi förbereder din leverans." :
        locale === "en" ? "Your order is confirmed and we are preparing your shipment." :
        "Tilauksesi on vastaanotettu ja valmistelemme lähetystäsi."}
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;margin-bottom:16px">
      ${itemsHtml}
      <tr style="border-top:2px solid #111">
        <td style="padding:12px 0;font-weight:700;color:#111">
          ${locale === "sv" ? "Totalt" : locale === "en" ? "Total" : "Yhteensä"}
        </td>
        <td style="padding:12px 0;text-align:right;font-weight:700;color:#111">${fmt(total, currency)}</td>
      </tr>
    </table>
    <p style="color:#888;font-size:12px">Robust Nordic · robustnordic.fi</p>
  </div>`

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
      if (email) {
        // Webhook payloads don't include line items — fetch them.
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items"],
        })
        await sendOrderConfirmation({
          to: email,
          customerName: session.customer_details?.name ?? null,
          lineItems: (full.line_items?.data ?? []).map((li) => ({
            description: li.description,
            amount_total: li.amount_total ?? 0,
            currency: li.currency,
          })),
          total: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          locale: session.metadata?.locale ?? "fi",
        })
      }
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
