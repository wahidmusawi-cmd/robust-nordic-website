import Stripe from "stripe"

let client: Stripe | null | undefined

function readKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY
  // Placeholder values from .env.example (e.g. "sk_test_...") don't count.
  if (!key || key.includes("...") || key.trim().length < 12) return null
  return key
}

/** Returns a memoized Stripe client, or null when no usable key is set. */
export function getStripe(): Stripe | null {
  if (client !== undefined) return client
  const key = readKey()
  client = key ? new Stripe(key, { apiVersion: "2025-02-24.acacia" }) : null
  return client
}

export function isStripeConfigured(): boolean {
  return readKey() !== null
}

export function isTestMode(): boolean {
  const key = readKey()
  return key !== null && (key.startsWith("sk_test_") || key.startsWith("rk_test_"))
}

export function isWebhookConfigured(): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  return Boolean(secret && !secret.includes("...") && secret.trim().length > 6)
}

function dashboardBase(): string {
  return isTestMode() ? "https://dashboard.stripe.com/test" : "https://dashboard.stripe.com"
}

export function stripeDashboardUrl(): string {
  return dashboardBase()
}

export function stripePaymentUrl(paymentIntentId: string): string {
  return `${dashboardBase()}/payments/${paymentIntentId}`
}

export function stripeSessionSearchUrl(sessionId: string): string {
  return `${dashboardBase()}/search?query=${encodeURIComponent(sessionId)}`
}
