// Finnish-locale formatting helpers for the admin. Money in = integer cents.

export const HELSINKI_TZ = "Europe/Helsinki"

const eur = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" })
const eurRounded = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})
const number = new Intl.NumberFormat("fi-FI")
const percent = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 1 })

export function formatEur(cents: number): string {
  return eur.format(cents / 100)
}

// Currencies whose Stripe amounts are whole units, not hundredths.
const ZERO_DECIMAL = new Set(["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "vnd", "vuv", "xaf", "xof", "xpf"])
const moneyFormatters = new Map<string, Intl.NumberFormat>()

/** Like formatEur but honors the order's actual currency (e.g. "458,50 kr"). */
export function formatMoney(cents: number, currency: string): string {
  const code = currency.toLowerCase()
  if (code === "eur") return formatEur(cents)
  let fmt = moneyFormatters.get(code)
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat("fi-FI", { style: "currency", currency: code.toUpperCase() })
    } catch {
      fmt = eur
    }
    moneyFormatters.set(code, fmt)
  }
  return fmt.format(ZERO_DECIMAL.has(code) ? cents : cents / 100)
}

/** Whole euros — for axis ticks and compact stats. */
export function formatEurRounded(cents: number): string {
  return eurRounded.format(cents / 100)
}

export function formatNumber(n: number): string {
  return number.format(n)
}

/** `0.124` → `"12,4 %"` */
export function formatPercent(fraction: number): string {
  return `${percent.format(fraction * 100)} %`
}

export type Delta = {
  text: string
  direction: "up" | "down" | "flat"
}

/** Percent change vs a previous period; null when there is no baseline. */
export function computeDelta(current: number, previous: number): Delta | null {
  if (previous === 0) return null
  const change = (current - previous) / previous
  const direction = change > 0.0005 ? "up" : change < -0.0005 ? "down" : "flat"
  const sign = direction === "up" ? "+" : ""
  return { text: `${sign}${percent.format(change * 100)} %`, direction }
}

const dateFmt = new Intl.DateTimeFormat("fi-FI", {
  timeZone: HELSINKI_TZ,
  day: "numeric",
  month: "numeric",
  year: "numeric",
})
const dateTimeFmt = new Intl.DateTimeFormat("fi-FI", {
  timeZone: HELSINKI_TZ,
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})
const dayFmt = new Intl.DateTimeFormat("fi-FI", {
  timeZone: HELSINKI_TZ,
  day: "numeric",
  month: "numeric",
})
const weekdayFmt = new Intl.DateTimeFormat("fi-FI", { timeZone: HELSINKI_TZ, weekday: "short" })
// en-CA renders YYYY-MM-DD, which makes a stable per-day bucket key.
const dayKeyFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: HELSINKI_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export function formatDate(ms: number): string {
  return dateFmt.format(ms)
}

export function formatDateTime(ms: number): string {
  return dateTimeFmt.format(ms)
}

/** Short day label, e.g. "3.7." */
export function formatDay(ms: number): string {
  return dayFmt.format(ms)
}

export function formatWeekday(ms: number): string {
  return weekdayFmt.format(ms)
}

/** Helsinki-local calendar-day key: "2026-07-03". */
export function dayKey(ms: number): string {
  return dayKeyFmt.format(ms)
}
