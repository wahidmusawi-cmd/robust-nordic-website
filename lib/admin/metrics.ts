// Pure metric computation over an OrdersResult. Every page derives its numbers
// from the same fetched slice, so tiles, charts and tables always agree.

import { products } from "@/lib/products"
import { dayKey, formatDay } from "./format"
import type { OrdersResult } from "./orders"
import type { AdminOrder, CustomerSummary, OrderStatus, RangeDays } from "./types"

const DAY_MS = 86_400_000

export type SeriesPoint = {
  key: string
  label: string
  sales: number
  orders: number
  aov: number
}

export type NameValue = { label: string; value: number }

export type ProductPerf = {
  slug: string | null
  name: string
  image: string | null
  units: number
  sales: number
}

export type CategoryShare = { key: string; label: string; sales: number; share: number }

export type CountryPerf = { code: string; label: string; orders: number; sales: number }

export type Overview = {
  rangeDays: RangeDays
  netSales: number
  netSalesPrev: number
  orderCount: number
  orderCountPrev: number
  aov: number
  aovPrev: number
  unitsSold: number
  unitsSoldPrev: number
  refundedAmount: number
  abandonedCount: number
  abandonedCountPrev: number
  /** paid ÷ all finished checkout attempts (paid + expired); null when no attempts. */
  checkoutConversion: number | null
  dailySeries: SeriesPoint[]
  sparkSales: number[]
  sparkOrders: number[]
  sparkAov: number[]
  sparkAbandoned: number[]
  topProducts: ProductPerf[]
  categoryMix: CategoryShare[]
  countryMix: CountryPerf[]
  statusMix: Array<{ status: OrderStatus; count: number }>
  weekdayOrders: NameValue[]
  newCustomers: number
  returningCustomers: number
}

export function isPaidLike(order: AdminOrder): boolean {
  return order.status === "paid" || order.status === "refunded" || order.status === "partially_refunded"
}

/** Order revenue after refunds. */
export function netSalesOf(order: AdminOrder): number {
  return order.amountTotal - order.amountRefunded
}

export const COUNTRY_LABELS: Record<string, string> = {
  FI: "Suomi",
  SE: "Ruotsi",
  EE: "Viro",
  DE: "Saksa",
  DK: "Tanska",
  NO: "Norja",
}

export const CATEGORY_LABELS: Record<string, string> = {
  ravintolisat: "Ravintolisät",
  hyvinvointi: "Hyvinvointi",
  muu: "Muu",
}

const productBySlug = new Map(products.map((p) => [p.slug, p] as const))

/** Downsample a series to at most `points` buckets by summing. */
export function resample(values: number[], points: number): number[] {
  if (values.length <= points) return values
  const out: number[] = []
  const size = values.length / points
  for (let i = 0; i < points; i++) {
    const start = Math.floor(i * size)
    const end = Math.floor((i + 1) * size)
    out.push(values.slice(start, Math.max(end, start + 1)).reduce((s, v) => s + v, 0))
  }
  return out
}

function buildDailySeries(orders: AdminOrder[], days: number, now: number): SeriesPoint[] {
  const buckets = new Map<string, SeriesPoint>()
  // Half-day steps over days..0 (not days-1): the window's oldest partial
  // calendar day gets a bucket too (chart totals match the tiles), and a 25h
  // DST day can't be skipped. Duplicate keys collapse via the Map.
  for (let i = days * 2; i >= 0; i--) {
    const ts = now - i * (DAY_MS / 2)
    const key = dayKey(ts)
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: formatDay(ts), sales: 0, orders: 0, aov: 0 })
    }
  }
  for (const order of orders) {
    if (!isPaidLike(order)) continue
    const bucket = buckets.get(dayKey(order.created))
    if (!bucket) continue
    bucket.sales += netSalesOf(order)
    bucket.orders += 1
  }
  const series = [...buckets.values()]
  for (const point of series) {
    point.aov = point.orders > 0 ? Math.round(point.sales / point.orders) : 0
  }
  return series
}

const WEEKDAYS = ["ma", "ti", "ke", "to", "pe", "la", "su"]
const weekdayFmt = new Intl.DateTimeFormat("fi-FI", { timeZone: "Europe/Helsinki", weekday: "short" })

export function computeOverview(result: OrdersResult, days: RangeDays): Overview {
  const now = result.fetchedAt
  const windowStart = now - days * DAY_MS
  const prevStart = now - days * 2 * DAY_MS

  const current = result.orders.filter((o) => o.created >= windowStart)
  const previous = result.orders.filter((o) => o.created >= prevStart && o.created < windowStart)

  const paid = current.filter(isPaidLike)
  const paidPrev = previous.filter(isPaidLike)

  const netSales = paid.reduce((s, o) => s + netSalesOf(o), 0)
  const netSalesPrev = paidPrev.reduce((s, o) => s + netSalesOf(o), 0)

  const unitsSold = paid.reduce((s, o) => s + o.itemCount, 0)
  const unitsSoldPrev = paidPrev.reduce((s, o) => s + o.itemCount, 0)

  const abandoned = current.filter((o) => o.status === "expired")
  const abandonedPrev = previous.filter((o) => o.status === "expired")

  const finishedAttempts = paid.length + abandoned.length

  const dailySeries = buildDailySeries(current, days, now)
  const abandonedDaily = (() => {
    const map = new Map(dailySeries.map((p) => [p.key, 0]))
    for (const o of abandoned) {
      const key = dayKey(o.created)
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.values()]
  })()

  // Product / category / country aggregation over paid orders in the window.
  const perfMap = new Map<string, ProductPerf>()
  const categorySales = new Map<string, number>()
  let categoryTotal = 0
  const countryMap = new Map<string, CountryPerf>()

  for (const order of paid) {
    for (const item of order.items) {
      const key = item.slug ?? item.description
      const product = item.slug ? productBySlug.get(item.slug) : undefined
      const perf = perfMap.get(key) ?? {
        slug: item.slug,
        name: product?.shortName ?? item.description,
        image: item.image ?? product?.image ?? null,
        units: 0,
        sales: 0,
      }
      perf.units += item.quantity
      perf.sales += item.amountTotal
      perfMap.set(key, perf)

      const category = product?.category ?? "muu"
      categorySales.set(category, (categorySales.get(category) ?? 0) + item.amountTotal)
      categoryTotal += item.amountTotal
    }

    const code = order.shippingAddress?.country ?? "??"
    const country = countryMap.get(code) ?? {
      code,
      label: COUNTRY_LABELS[code] ?? (code === "??" ? "Tuntematon" : code),
      orders: 0,
      sales: 0,
    }
    country.orders += 1
    country.sales += netSalesOf(order)
    countryMap.set(code, country)
  }

  const statusCounts = new Map<OrderStatus, number>()
  for (const order of current) {
    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1)
  }

  const weekdayCounts = new Map<string, number>(WEEKDAYS.map((d) => [d, 0]))
  for (const order of paid) {
    const label = weekdayFmt.format(order.created).replace(".", "")
    if (weekdayCounts.has(label)) weekdayCounts.set(label, (weekdayCounts.get(label) ?? 0) + 1)
  }

  // New vs returning: first order (within the fetched horizon) inside window.
  const firstOrderByEmail = new Map<string, number>()
  for (const order of result.orders) {
    if (!isPaidLike(order) || !order.customerEmail) continue
    const email = order.customerEmail.toLowerCase()
    const first = firstOrderByEmail.get(email)
    if (first === undefined || order.created < first) firstOrderByEmail.set(email, order.created)
  }
  let newCustomers = 0
  let returningCustomers = 0
  const seenInWindow = new Set<string>()
  for (const order of paid) {
    const email = order.customerEmail?.toLowerCase()
    if (!email || seenInWindow.has(email)) continue
    seenInWindow.add(email)
    if ((firstOrderByEmail.get(email) ?? 0) >= windowStart) newCustomers++
    else returningCustomers++
  }

  return {
    rangeDays: days,
    netSales,
    netSalesPrev,
    orderCount: paid.length,
    orderCountPrev: paidPrev.length,
    // Net basis, so the tile always reconciles with Myynti ÷ Tilaukset and
    // with the daily AOV series.
    aov: paid.length > 0 ? Math.round(netSales / paid.length) : 0,
    aovPrev: paidPrev.length > 0 ? Math.round(netSalesPrev / paidPrev.length) : 0,
    unitsSold,
    unitsSoldPrev,
    refundedAmount: paid.reduce((s, o) => s + o.amountRefunded, 0),
    abandonedCount: abandoned.length,
    abandonedCountPrev: abandonedPrev.length,
    checkoutConversion: finishedAttempts > 0 ? paid.length / finishedAttempts : null,
    dailySeries,
    sparkSales: resample(dailySeries.map((p) => p.sales), 12),
    sparkOrders: resample(dailySeries.map((p) => p.orders), 12),
    sparkAov: (() => {
      const sales = resample(dailySeries.map((p) => p.sales), 12)
      const counts = resample(dailySeries.map((p) => p.orders), 12)
      return sales.map((s, i) => (counts[i] > 0 ? Math.round(s / counts[i]) : 0))
    })(),
    sparkAbandoned: resample(abandonedDaily, 12),
    topProducts: [...perfMap.values()].sort((a, b) => b.sales - a.sales),
    categoryMix: [...categorySales.entries()]
      .map(([key, sales]) => ({
        key,
        label: CATEGORY_LABELS[key] ?? key,
        sales,
        share: categoryTotal > 0 ? sales / categoryTotal : 0,
      }))
      .sort((a, b) => b.sales - a.sales),
    countryMix: [...countryMap.values()].sort((a, b) => b.sales - a.sales),
    statusMix: [...statusCounts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count),
    weekdayOrders: WEEKDAYS.map((label) => ({ label, value: weekdayCounts.get(label) ?? 0 })),
    newCustomers,
    returningCustomers,
  }
}

/** Customers aggregated over every paid order in the fetched horizon. */
export function computeCustomers(result: OrdersResult): CustomerSummary[] {
  const byEmail = new Map<string, CustomerSummary>()
  for (const order of result.orders) {
    if (!isPaidLike(order) || !order.customerEmail) continue
    const email = order.customerEmail.toLowerCase()
    const existing = byEmail.get(email)
    if (!existing) {
      byEmail.set(email, {
        email,
        name: order.customerName,
        orderCount: 1,
        totalSpent: netSalesOf(order),
        lastOrderAt: order.created,
        firstOrderAt: order.created,
        country: order.shippingAddress?.country ?? null,
        lastOrderId: order.id,
      })
      continue
    }
    existing.orderCount += 1
    existing.totalSpent += netSalesOf(order)
    if (order.created > existing.lastOrderAt) {
      existing.lastOrderAt = order.created
      existing.lastOrderId = order.id
      existing.name = order.customerName ?? existing.name
      existing.country = order.shippingAddress?.country ?? existing.country
    }
    if (order.created < existing.firstOrderAt) existing.firstOrderAt = order.created
  }
  return [...byEmail.values()].sort((a, b) => b.totalSpent - a.totalSpent)
}

/** Daily sales/units series for a single product (for the product detail page). */
export function computeProductSeries(
  result: OrdersResult,
  slug: string,
  days: RangeDays,
): { series: SeriesPoint[]; units: number; sales: number; orders: number } {
  const now = result.fetchedAt
  const windowStart = now - days * DAY_MS
  const buckets = new Map<string, SeriesPoint>()
  // Same half-day-step span as buildDailySeries: partial oldest day included,
  // DST-safe.
  for (let i = days * 2; i >= 0; i--) {
    const ts = now - i * (DAY_MS / 2)
    const key = dayKey(ts)
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: formatDay(ts), sales: 0, orders: 0, aov: 0 })
    }
  }
  let units = 0
  let sales = 0
  let orderCount = 0
  for (const order of result.orders) {
    if (!isPaidLike(order) || order.created < windowStart) continue
    const line = order.items.filter((it) => it.slug === slug)
    if (line.length === 0) continue
    orderCount += 1
    const bucket = buckets.get(dayKey(order.created))
    for (const item of line) {
      units += item.quantity
      sales += item.amountTotal
      if (bucket) {
        bucket.sales += item.amountTotal
        bucket.orders += item.quantity
      }
    }
  }
  return { series: [...buckets.values()], units, sales, orders: orderCount }
}
