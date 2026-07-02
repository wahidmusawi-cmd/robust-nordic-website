// Deterministic demo dataset for the admin when no Stripe key is configured.
// Same seed → same store, so numbers stay stable while navigating. Regenerated
// once per hour so "today" keeps moving.

import { products } from "@/lib/products"
import type { AdminOrder, AdminOrderItem, OrderStatus } from "./types"

const DAYS_BACK = 190
const SEED = 715517

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST_NAMES = [
  "Aino", "Eero", "Helmi", "Juhani", "Kaisa", "Lauri", "Maija", "Niko", "Oona", "Pekka",
  "Riikka", "Sami", "Tiina", "Ville", "Anna", "Mikko", "Laura", "Jari", "Sanna", "Timo",
  "Emilia", "Antti", "Hanna", "Jukka", "Noora", "Petri", "Sofia", "Markus", "Elina", "Heikki",
  "Ida", "Olli", "Venla", "Tuomas", "Krista", "Erik", "Astrid", "Johan", "Linnea", "Magnus",
]
const LAST_NAMES = [
  "Virtanen", "Korhonen", "Mäkinen", "Nieminen", "Hämäläinen", "Laine", "Koskinen", "Järvinen",
  "Lehtonen", "Saarinen", "Salminen", "Heikkinen", "Tuominen", "Rantanen", "Aaltonen", "Kinnunen",
  "Leppänen", "Väisänen", "Andersson", "Lindqvist", "Bergström", "Nilsson", "Karlsson", "Johansson",
]
const DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "icloud.com", "suomi24.fi"]
const COUNTRIES: Array<{ code: string; weight: number; cities: string[] }> = [
  { code: "FI", weight: 76, cities: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Kuopio", "Lahti"] },
  { code: "SE", weight: 12, cities: ["Stockholm", "Göteborg", "Malmö", "Uppsala"] },
  { code: "EE", weight: 4, cities: ["Tallinn", "Tartu"] },
  { code: "DE", weight: 4, cities: ["Berlin", "Hamburg", "München"] },
  { code: "DK", weight: 2, cities: ["København", "Aarhus"] },
  { code: "NO", weight: 2, cities: ["Oslo", "Bergen"] },
]
const STREETS = [
  "Mannerheimintie", "Hämeentie", "Aleksanterinkatu", "Keskuskatu", "Rantatie", "Koulukatu",
  "Kirkkokatu", "Puistokatu", "Asemakatu", "Satamakatu", "Storgatan", "Kungsgatan",
]

type DemoCustomer = {
  name: string
  email: string
  country: string
  city: string
  street: string
  postalCode: string
  /** Higher → more likely to order again. */
  loyalty: number
}

function priceCents(price: string): number {
  return Math.round(Number(price.replace(",", ".")) * 100)
}

function pickWeighted<T>(rand: () => number, entries: Array<{ item: T; weight: number }>): T {
  const total = entries.reduce((s, e) => s + e.weight, 0)
  let roll = rand() * total
  for (const e of entries) {
    roll -= e.weight
    if (roll <= 0) return e.item
  }
  return entries[entries.length - 1].item
}

function buildCustomers(rand: () => number): DemoCustomer[] {
  const customers: DemoCustomer[] = []
  const seen = new Set<string>()
  while (customers.length < 64) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const email = `${first}.${last}@${DOMAINS[Math.floor(rand() * DOMAINS.length)]}`
      .toLowerCase()
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/å/g, "a")
    if (seen.has(email)) continue
    seen.add(email)
    const country = pickWeighted(
      rand,
      COUNTRIES.map((c) => ({ item: c, weight: c.weight })),
    )
    customers.push({
      name: `${first} ${last}`,
      email,
      country: country.code,
      city: country.cities[Math.floor(rand() * country.cities.length)],
      street: `${STREETS[Math.floor(rand() * STREETS.length)]} ${1 + Math.floor(rand() * 80)}`,
      postalCode: String(10000 + Math.floor(rand() * 89999)),
      loyalty: 1 + Math.floor(rand() * rand() * 8),
    })
  }
  return customers
}

const catalog = products.map((p) => ({
  item: p,
  weight: p.badge === "Suosittu" ? 3 : p.badge === "Uutuus" ? 2 : 1,
}))

function generate(now: number): AdminOrder[] {
  const rand = mulberry32(SEED)
  const customers = buildCustomers(rand)
  const orders: AdminOrder[] = []
  const dayMs = 86_400_000
  let sequence = 1001

  for (let back = DAYS_BACK; back >= 0; back--) {
    const dayStart = now - back * dayMs
    const date = new Date(dayStart)
    const weekday = date.getUTCDay() // 0=Sun
    // Slow upward trend plus a weekend bump and campaign spikes.
    const trend = 2.2 + (DAYS_BACK - back) * 0.012
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.35 : 1
    const spike = rand() < 0.05 ? 2.4 : 1
    const attempts = Math.max(0, Math.round((trend * weekendBoost * spike) * (0.5 + rand())))

    for (let i = 0; i < attempts; i++) {
      const created = dayStart + Math.floor(rand() * dayMs * 0.92)
      if (created > now) continue
      const customer = pickWeighted(
        rand,
        customers.map((c) => ({ item: c, weight: c.loyalty })),
      )

      const itemCountRoll = rand()
      const lineCount = itemCountRoll < 0.62 ? 1 : itemCountRoll < 0.9 ? 2 : 3
      const chosen = new Map<string, { slug: string; qty: number }>()
      for (let l = 0; l < lineCount; l++) {
        const product = pickWeighted(rand, catalog)
        const qty = rand() < 0.85 ? 1 : 2
        const existing = chosen.get(product.slug)
        if (existing) existing.qty += qty
        else chosen.set(product.slug, { slug: product.slug, qty })
      }

      const items: AdminOrderItem[] = [...chosen.values()].map(({ slug, qty }) => {
        const product = products.find((p) => p.slug === slug)!
        const unit = priceCents(product.price)
        return {
          description: product.name,
          quantity: qty,
          amountTotal: unit * qty,
          unitAmount: unit,
          priceId: product.stripePriceId ?? null,
          slug,
          image: product.image,
        }
      })

      const amountSubtotal = items.reduce((s, it) => s + it.amountTotal, 0)
      const hasDiscount = rand() < 0.08
      const amountDiscount = hasDiscount ? Math.round(amountSubtotal * 0.1) : 0
      const amountShipping = amountSubtotal - amountDiscount >= 4900 ? 0 : 490
      const amountTotal = amountSubtotal - amountDiscount + amountShipping

      const ageMs = now - created
      let status: OrderStatus
      const statusRoll = rand()
      if (ageMs < dayMs * 1.5 && statusRoll > 0.9) status = "open"
      else if (statusRoll > 0.79) status = "expired"
      else status = "paid"

      const refunds = []
      let amountRefunded = 0
      if (status === "paid" && rand() < 0.025 && ageMs > dayMs * 2) {
        const full = rand() < 0.7
        amountRefunded = full ? amountTotal : Math.round(amountTotal * (0.3 + rand() * 0.4))
        refunds.push({
          amount: amountRefunded,
          // Never date a refund into the future.
          created: Math.min(created + dayMs * (1 + Math.floor(rand() * 6)), now - 3_600_000),
        })
        status = full ? "refunded" : "partially_refunded"
      }

      const isPaidLike = status !== "open" && status !== "expired"
      orders.push({
        id: `cs_demo_${sequence}`,
        number: `#${sequence}`,
        created,
        status,
        amountTotal,
        amountSubtotal,
        amountDiscount,
        amountShipping,
        amountTax: 0,
        amountRefunded,
        currency: "eur",
        customerName: customer.name,
        customerEmail: customer.email,
        shippingName: isPaidLike ? customer.name : null,
        shippingAddress: isPaidLike
          ? {
              line1: customer.street,
              line2: null,
              postalCode: customer.postalCode,
              city: customer.city,
              country: customer.country,
            }
          : null,
        items,
        itemCount: items.reduce((s, it) => s + it.quantity, 0),
        locale: customer.country === "FI" ? "fi" : customer.country === "SE" ? "sv" : "en",
        paymentIntentId: isPaidLike ? `pi_demo_${sequence}` : null,
        refunds,
      })
      sequence++
    }
  }

  orders.sort((a, b) => b.created - a.created)
  return orders
}

let memo: { key: number; orders: AdminOrder[] } | null = null

export function getDemoOrders(now: number): AdminOrder[] {
  const key = Math.floor(now / 3_600_000)
  if (!memo || memo.key !== key) {
    // Anchor generation to the top of the hour so every caller inside the same
    // hour sees an identical dataset (list and detail views stay consistent).
    memo = { key, orders: generate(key * 3_600_000) }
  }
  return memo.orders
}
