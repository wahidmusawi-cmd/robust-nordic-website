// Order data access for the admin. Reads Checkout Sessions straight from the
// Stripe API (no database); falls back to the deterministic demo dataset when
// no Stripe key is configured. Always fetches a 2× window so metrics can
// compare against the previous period.

import { cache } from "react"
import type Stripe from "stripe"
import { products } from "@/lib/products"
import { getDemoOrders } from "./demo-data"
import { getStripe } from "./stripe"
import type {
  AdminAddress,
  AdminOrder,
  AdminOrderDetail,
  AdminRefund,
  OrderStatus,
  RangeDays,
} from "./types"

export type OrdersResult = {
  orders: AdminOrder[]
  isDemo: boolean
  fetchedAt: number
}

const MAX_SESSIONS = 1000
const MAX_REFUNDS = 500
const TTL_MS = 60_000

const productByPriceId = new Map(
  products.filter((p) => p.stripePriceId).map((p) => [p.stripePriceId!, p] as const),
)

function orderNumber(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`
}

type ShippingLike = {
  name?: string | null
  address?: {
    line1?: string | null
    line2?: string | null
    postal_code?: string | null
    city?: string | null
    country?: string | null
  } | null
}

function toAddress(a: ShippingLike["address"]): AdminAddress | null {
  if (!a) return null
  return {
    line1: a.line1 ?? null,
    line2: a.line2 ?? null,
    postalCode: a.postal_code ?? null,
    city: a.city ?? null,
    country: a.country ?? null,
  }
}

/** Shipping moved under `collected_information` in newer API versions — read both. */
function extractShipping(session: Stripe.Checkout.Session): ShippingLike | null {
  const collected = (session as unknown as { collected_information?: { shipping_details?: ShippingLike | null } })
    .collected_information?.shipping_details
  if (collected?.address) return collected
  const legacy = (session as unknown as { shipping_details?: ShippingLike | null }).shipping_details
  if (legacy?.address) return legacy
  return null
}

function resolveStatus(session: Stripe.Checkout.Session, amountRefunded: number): OrderStatus {
  if (session.status === "expired") return "expired"
  if (session.status !== "complete" || session.payment_status === "unpaid") return "open"
  if (amountRefunded <= 0) return "paid"
  return amountRefunded >= (session.amount_total ?? 0) ? "refunded" : "partially_refunded"
}

function mapSession(
  session: Stripe.Checkout.Session,
  refundsByPaymentIntent: Map<string, AdminRefund[]>,
): AdminOrder {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  // Adaptive Pricing: the customer paid in a local currency (e.g. SEK) while
  // the store's prices are EUR. Normalize every amount back to the source
  // currency so metrics aggregate correctly, and keep the charged amount in
  // `presentment` for display.
  const conversion = session.currency_conversion
  const fx = conversion ? Number(conversion.fx_rate) : 1
  const toSource = (amount: number) => (conversion && fx > 0 ? Math.round(amount / fx) : amount)

  const rawRefunds = (paymentIntentId && refundsByPaymentIntent.get(paymentIntentId)) || []
  const refunds = rawRefunds.map((r) => ({ ...r, amount: toSource(r.amount) }))
  const amountRefunded = refunds.reduce((s, r) => s + r.amount, 0)

  const items = (session.line_items?.data ?? []).map((li) => {
    const priceId = li.price?.id ?? null
    const product = priceId ? productByPriceId.get(priceId) : undefined
    return {
      description: li.description ?? product?.name ?? "Tuote",
      quantity: li.quantity ?? 1,
      amountTotal: toSource(li.amount_total ?? 0),
      unitAmount: li.price?.unit_amount != null ? toSource(li.price.unit_amount) : null,
      priceId,
      slug: product?.slug ?? (session.metadata?.slug || null),
      image: product?.image ?? null,
    }
  })

  const shipping = extractShipping(session)

  return {
    id: session.id,
    number: orderNumber(session.id),
    created: session.created * 1000,
    status: resolveStatus(session, amountRefunded),
    amountTotal: toSource(session.amount_total ?? 0),
    amountSubtotal: toSource(session.amount_subtotal ?? 0),
    amountDiscount: toSource(session.total_details?.amount_discount ?? 0),
    amountShipping: toSource(session.total_details?.amount_shipping ?? 0),
    amountTax: toSource(session.total_details?.amount_tax ?? 0),
    amountRefunded,
    currency: conversion?.source_currency ?? session.currency ?? "eur",
    presentment: conversion
      ? { currency: session.currency ?? "eur", amountTotal: session.amount_total ?? 0 }
      : null,
    customerName: session.customer_details?.name ?? null,
    customerEmail: session.customer_details?.email ?? null,
    shippingName: shipping?.name ?? null,
    shippingAddress: toAddress(shipping?.address) ?? toAddress(session.customer_details?.address),
    items,
    itemCount: items.reduce((s, it) => s + it.quantity, 0),
    locale: session.metadata?.locale ?? null,
    paymentIntentId,
    refunds,
  }
}

async function fetchRefunds(stripe: Stripe, sinceSec: number): Promise<Map<string, AdminRefund[]>> {
  const byPaymentIntent = new Map<string, AdminRefund[]>()
  let count = 0
  for await (const refund of stripe.refunds.list({ limit: 100, created: { gte: sinceSec } })) {
    // Failed/canceled refunds never moved money — don't count them.
    if (refund.status === "failed" || refund.status === "canceled") continue
    const pi = typeof refund.payment_intent === "string" ? refund.payment_intent : refund.payment_intent?.id
    if (pi) {
      const list = byPaymentIntent.get(pi) ?? []
      list.push({ amount: refund.amount, created: refund.created * 1000 })
      byPaymentIntent.set(pi, list)
    }
    if (++count >= MAX_REFUNDS) break
  }
  return byPaymentIntent
}

async function fetchOrdersUncached(days: RangeDays): Promise<OrdersResult> {
  const now = Date.now()
  const windowStartMs = now - days * 2 * 86_400_000
  const stripe = getStripe()

  if (!stripe) {
    return {
      orders: getDemoOrders(now).filter((o) => o.created >= windowStartMs),
      isDemo: true,
      fetchedAt: now,
    }
  }

  const sinceSec = Math.floor(windowStartMs / 1000)
  const sessions: Stripe.Checkout.Session[] = []
  for await (const session of stripe.checkout.sessions.list({
    limit: 100,
    created: { gte: sinceSec },
    expand: ["data.line_items"],
  })) {
    sessions.push(session)
    if (sessions.length >= MAX_SESSIONS) break
  }

  const refundsByPaymentIntent = await fetchRefunds(stripe, sinceSec)
  const orders = sessions
    .map((s) => mapSession(s, refundsByPaymentIntent))
    .sort((a, b) => b.created - a.created)

  return { orders, isDemo: false, fetchedAt: now }
}

const ttlCache = new Map<RangeDays, { at: number; data: OrdersResult }>()

/**
 * Orders for the requested range PLUS the preceding equal-length period
 * (for deltas). Deduped per request via React cache and across requests for
 * 60 s so navigating the admin doesn't hammer the Stripe API.
 */
export const getOrders = cache(async (days: RangeDays): Promise<OrdersResult> => {
  const hit = ttlCache.get(days)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data
  const data = await fetchOrdersUncached(days)
  ttlCache.set(days, { at: Date.now(), data })
  return data
})

/** Single order with receipt link. Returns null when not found. */
export const getOrder = cache(async (id: string): Promise<AdminOrderDetail | null> => {
  const stripe = getStripe()

  if (!stripe) {
    const order = getDemoOrders(Date.now()).find((o) => o.id === id)
    return order ? { ...order, receiptUrl: null } : null
  }
  // With live Stripe configured, fabricated demo ids must never resolve.
  if (id.startsWith("cs_demo_")) return null

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["line_items", "payment_intent", "payment_intent.latest_charge.refunds"],
    })
  } catch (err) {
    // Only a genuinely missing/invalid id is "not found" — anything else
    // (auth, network, rate limit) should surface via the error boundary.
    const stripeErr = err as { code?: string; statusCode?: number }
    if (stripeErr?.code === "resource_missing" || stripeErr?.statusCode === 404) return null
    throw err
  }

  // Expanded lists are truncated at 10 items — fetch the rest if needed.
  if (session.line_items?.has_more) {
    const all = await stripe.checkout.sessions.listLineItems(id, { limit: 100 })
    session.line_items.data = all.data
  }

  const paymentIntent =
    typeof session.payment_intent === "object" && session.payment_intent !== null
      ? session.payment_intent
      : null
  const charge =
    paymentIntent && typeof paymentIntent.latest_charge === "object" && paymentIntent.latest_charge !== null
      ? paymentIntent.latest_charge
      : null

  const refundsByPaymentIntent = new Map<string, AdminRefund[]>()
  if (paymentIntent && charge?.refunds?.data?.length) {
    refundsByPaymentIntent.set(
      paymentIntent.id,
      charge.refunds.data
        .filter((r) => r.status !== "failed" && r.status !== "canceled")
        .map((r) => ({ amount: r.amount, created: r.created * 1000 })),
    )
  }

  const order = mapSession(session, refundsByPaymentIntent)
  return { ...order, receiptUrl: charge?.receipt_url ?? null }
})
