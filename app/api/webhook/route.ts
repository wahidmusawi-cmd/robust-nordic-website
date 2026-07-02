import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/admin/stripe"

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
      // TODO: trigger fulfillment (email confirmation, order in CRM, etc.)
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
