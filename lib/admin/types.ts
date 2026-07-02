// Shared admin data types. All money amounts are integer cents in EUR.

export type OrderStatus =
  | "paid"
  | "open" // checkout started, not completed yet
  | "expired" // abandoned checkout
  | "refunded"
  | "partially_refunded"

export type AdminOrderItem = {
  description: string
  quantity: number
  /** Line total in cents (after line-level discounts). */
  amountTotal: number
  /** Unit price in cents, if known. */
  unitAmount: number | null
  priceId: string | null
  /** Catalog slug, resolved via stripePriceId when possible. */
  slug: string | null
  image: string | null
}

export type AdminAddress = {
  line1: string | null
  line2: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}

export type AdminRefund = {
  amount: number
  created: number // epoch ms
}

export type AdminOrder = {
  /** Stripe Checkout Session id (or `cs_demo_*` in demo mode). */
  id: string
  /** Short display reference, e.g. "#A1B2C3". */
  number: string
  created: number // epoch ms
  status: OrderStatus
  amountTotal: number
  amountSubtotal: number
  amountDiscount: number
  amountShipping: number
  amountTax: number
  amountRefunded: number
  currency: string
  customerName: string | null
  customerEmail: string | null
  shippingName: string | null
  shippingAddress: AdminAddress | null
  items: AdminOrderItem[]
  itemCount: number
  locale: string | null
  paymentIntentId: string | null
  refunds: AdminRefund[]
}

export type AdminOrderDetail = AdminOrder & {
  receiptUrl: string | null
}

export type CustomerSummary = {
  email: string
  name: string | null
  orderCount: number
  totalSpent: number
  lastOrderAt: number
  firstOrderAt: number
  country: string | null
  lastOrderId: string
}

export type RangeDays = 7 | 30 | 90

export function parseRange(value: string | string[] | undefined): RangeDays {
  const v = Array.isArray(value) ? value[0] : value
  if (v === "7") return 7
  if (v === "90") return 90
  return 30
}

export const RANGE_LABELS: Record<RangeDays, string> = {
  7: "Viimeiset 7 päivää",
  30: "Viimeiset 30 päivää",
  90: "Viimeiset 90 päivää",
}
