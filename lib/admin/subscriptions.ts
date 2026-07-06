// Subscription data access for the admin. Reads straight from the Stripe API;
// errors surface through the admin error boundary like the other data access.

import { cache } from "react"
import type Stripe from "stripe"
import { products } from "@/lib/products"
import { getStripe } from "./stripe"

export type SubscriptionRow = {
  id: string
  customerEmail: string | null
  customerName: string | null
  status: Stripe.Subscription.Status
  /** Catalog slugs resolved from the subscription's prices. */
  slugs: string[]
  intervalDays: string | null
  currentPeriodEnd: number // epoch ms
  /** Billing total per period, in cents. */
  amount: number
  currency: string
  cancelAtPeriodEnd: boolean
  created: number // epoch ms
}

const priceToSlug = new Map<string, string>()
for (const p of products) {
  for (const id of Object.values(p.stripeSubscriptionPriceIds ?? {})) {
    priceToSlug.set(id, p.slug)
  }
  if (p.stripePriceId) priceToSlug.set(p.stripePriceId, p.slug)
}

function toRow(sub: Stripe.Subscription): SubscriptionRow {
  const customer = sub.customer
  const details = typeof customer === "object" && !customer.deleted ? customer : null
  const amount = sub.items.data.reduce(
    (sum, item) => sum + (item.price?.unit_amount ?? 0) * (item.quantity ?? 1),
    0,
  )
  return {
    id: sub.id,
    customerEmail: details?.email ?? null,
    customerName: details?.name ?? null,
    status: sub.status,
    slugs: sub.items.data
      .map((item) => (item.price?.id ? priceToSlug.get(item.price.id) : undefined))
      .filter((s): s is string => Boolean(s)),
    intervalDays: sub.metadata?.intervalDays ?? null,
    currentPeriodEnd: sub.current_period_end * 1000,
    amount,
    currency: sub.items.data[0]?.price?.currency ?? "eur",
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    created: sub.created * 1000,
  }
}

export type SubscriptionsResult = {
  rows: SubscriptionRow[]
  /** True when the restricted API key lacks Subscriptions/Customers read access. */
  permissionError: boolean
}

export const getSubscriptions = cache(async (): Promise<SubscriptionsResult> => {
  const stripe = getStripe()
  if (!stripe) return { rows: [], permissionError: false } // demo mode

  const rows: SubscriptionRow[] = []
  try {
    for await (const sub of stripe.subscriptions.list({
      limit: 100,
      status: "all",
      expand: ["data.customer"],
    })) {
      // The embedded item list is capped at 10 — fetch the rest if needed.
      if (sub.items.has_more) {
        const all = await stripe.subscriptionItems.list({ subscription: sub.id, limit: 100 })
        sub.items.data = all.data
      }
      rows.push(toRow(sub))
      if (rows.length >= 500) break
    }
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 403 || status === 401) {
      return { rows: [], permissionError: true }
    }
    throw err
  }
  return { rows: rows.sort((a, b) => b.created - a.created), permissionError: false }
})
