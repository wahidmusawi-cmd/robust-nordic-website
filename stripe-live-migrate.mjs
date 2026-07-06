// Migrates the catalog's test-mode Stripe price IDs to live mode:
// creates a live Product + Price for each item in lib/products.ts and
// rewrites the stripePriceId values in place.
//
//   node stripe-live-migrate.mjs          # dry run — shows the plan only
//   node stripe-live-migrate.mjs --run    # creates live objects + updates lib/products.ts
//
// Reads STRIPE_SECRET_KEY from .env.migration.local (gitignored via .env*.local).
// Refuses to run with anything but a live-mode secret key. Idempotent: finds
// previously created live products via metadata.slug before creating new ones.

import fs from "node:fs"
import Stripe from "stripe"

const RUN = process.argv.includes("--run")
const ENV_FILE = ".env.migration.local"
const PRODUCTS_FILE = "lib/products.ts"

function fail(msg) {
  console.error(`\n✗ ${msg}`)
  process.exit(1)
}

// --- key ---------------------------------------------------------------
if (!fs.existsSync(ENV_FILE)) {
  fail(`${ENV_FILE} puuttuu. Aja ensin:\n  npx vercel env pull ${ENV_FILE} --environment=production --yes`)
}
const envText = fs.readFileSync(ENV_FILE, "utf8")
const keyMatch = envText.match(/^STRIPE_SECRET_KEY="?([^"\n]+)"?$/m)
const key = keyMatch?.[1]
if (!key) fail(`STRIPE_SECRET_KEY ei löydy tiedostosta ${ENV_FILE}`)
if (!key.startsWith("sk_live_") && !key.startsWith("rk_live_")) {
  fail("Avain ei ole live-tilan avain (sk_live_/rk_live_) — tämä skripti luo LIVE-objekteja, keskeytetään.")
}

// --- parse catalog -------------------------------------------------------
const source = fs.readFileSync(PRODUCTS_FILE, "utf8")
const blocks = source.split(/\n  \{\n/).slice(1)
const items = []
for (const block of blocks) {
  const slug = block.match(/slug: "([^"]+)"/)?.[1]
  const name = block.match(/name: "([^"]+)"/)?.[1]
  const price = block.match(/price: "([^"]+)"/)?.[1]
  const priceId = block.match(/stripePriceId: "([^"]+)"/)?.[1]
  const image = block.match(/image:\s*"([^"]+)"|image:\s*\n\s*"([^"]+)"/)
  if (!slug || !name || !price) continue
  items.push({
    slug,
    name,
    amount: Math.round(Number(price.replace(",", ".")) * 100),
    testPriceId: priceId ?? null,
    image: image?.[1] ?? image?.[2] ?? null,
  })
}
if (items.length === 0) fail("Tuotteita ei löytynyt lib/products.ts:stä — parseri ei osunut.")

console.log(`Katalogi: ${items.length} tuotetta, joista ${items.filter((i) => i.testPriceId).length} price-ID:llä\n`)
for (const item of items) {
  const eur = (item.amount / 100).toFixed(2).replace(".", ",")
  console.log(`  ${item.slug.padEnd(38)} ${eur.padStart(7)} €  ${item.testPriceId ?? "(ei price-ID:tä — ohitetaan)"}`)
}



// ─── Subscription prices ────────────────────────────────────────────────
// node stripe-live-migrate.mjs --subscriptions [--run]
// Creates recurring prices (30/60/90-day intervals, 15% off) for every
// product and writes stripeSubscriptionPriceIds into lib/products.ts.
// Idempotent: reuses an existing active recurring price when the interval
// and amount already match.
export async function migrateSubscriptions(stripe, items, source, RUN) {
  const INTERVALS = [30, 60, 90]
  const DISCOUNT = 0.15
  let updated = source

  for (const item of items) {
    if (!item.testPriceId) continue
    const subAmount = Math.round(item.amount * (1 - DISCOUNT))

    if (!RUN) {
      console.log(`  ${item.slug.padEnd(38)} ${(subAmount / 100).toFixed(2).replace(".", ",").padStart(7)} €/jakso (30/60/90 pv)`)
      continue
    }

    // The one-time live price points at its live product.
    let basePrice
    try {
      basePrice = await stripe.prices.retrieve(item.testPriceId)
    } catch {
      fail(`Hinta ${item.testPriceId} (${item.slug}) ei ole live-tilassa — aja ensin perusmigraatio: node stripe-live-migrate.mjs --run`)
    }
    const productId = typeof basePrice.product === "string" ? basePrice.product : basePrice.product.id

    const existing = await stripe.prices.list({ product: productId, limit: 100, active: true })
    const ids = {}
    for (const days of INTERVALS) {
      const match = existing.data.find(
        (p) =>
          p.recurring?.interval === "day" &&
          p.recurring?.interval_count === days &&
          p.unit_amount === subAmount &&
          p.currency === "eur",
      )
      if (match) {
        ids[days] = match.id
      } else {
        const created = await stripe.prices.create({
          product: productId,
          unit_amount: subAmount,
          currency: "eur",
          recurring: { interval: "day", interval_count: days },
          metadata: { slug: item.slug, intervalDays: String(days) },
        })
        ids[days] = created.id
      }
    }

    const block = `stripeSubscriptionPriceIds: { "30": "${ids[30]}", "60": "${ids[60]}", "90": "${ids[90]}" },`
    const anchor = `stripePriceId: "${item.testPriceId}",`
    if (!updated.includes(anchor)) fail(`anchoria ei löydy: ${item.slug}`)
    // Replace a previous block on rerun, otherwise insert after the anchor.
    const withOld = new RegExp(`(${anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\n\\s*stripeSubscriptionPriceIds: \\{[^}]*\\},`)
    updated = withOld.test(updated)
      ? updated.replace(withOld, `$1\n    ${block}`)
      : updated.replace(anchor, `${anchor}\n    ${block}`)
    console.log(`✓ ${item.slug} → 30/60/90 pv recurring-hinnat`)
  }

  // Recurring shipping price per interval (4,90 €/period), charged when the
  // subscription period total is under the 49 € free-shipping threshold.
  const SHIPPING_CENTS = 490
  if (!RUN) {
    console.log(`  ${"(toimitus)".padEnd(38)}    4,90 €/jakso (30/60/90 pv)`)
  } else {
    const found = await stripe.products.search({
      query: `metadata['slug']:'toimitus-kestotilaus' AND active:'true'`,
      limit: 1,
    })
    const shipProduct =
      found.data[0] ??
      (await stripe.products.create({
        name: "Toimitus (kestotilaus)",
        metadata: { slug: "toimitus-kestotilaus" },
      }))
    const existing = await stripe.prices.list({ product: shipProduct.id, limit: 100, active: true })
    const shipIds = {}
    for (const days of INTERVALS) {
      const match = existing.data.find(
        (p) =>
          p.recurring?.interval === "day" &&
          p.recurring?.interval_count === days &&
          p.unit_amount === SHIPPING_CENTS,
      )
      shipIds[days] =
        match?.id ??
        (
          await stripe.prices.create({
            product: shipProduct.id,
            unit_amount: SHIPPING_CENTS,
            currency: "eur",
            recurring: { interval: "day", interval_count: days },
            metadata: { slug: "toimitus-kestotilaus", intervalDays: String(days) },
          })
        ).id
    }
    const shipBlock = `export const shippingRecurringPriceIds: Record<string, string> = { "30": "${shipIds[30]}", "60": "${shipIds[60]}", "90": "${shipIds[90]}" }`
    const shipRe = /export const shippingRecurringPriceIds: Record<string, string> = \{[^}]*\}/
    if (!shipRe.test(updated)) fail("shippingRecurringPriceIds-vientiä ei löydy lib/products.ts:stä")
    updated = updated.replace(shipRe, shipBlock)
    console.log("✓ toimitus → 30/60/90 pv recurring-hinnat")
  }

  if (RUN) {
    fs.writeFileSync(PRODUCTS_FILE, updated)
    console.log(`\nValmis: stripeSubscriptionPriceIds + toimitushinnat kirjoitettu tiedostoon ${PRODUCTS_FILE}.`)
  } else {
    console.log("\nKuivaharjoitus — aja: node stripe-live-migrate.mjs --subscriptions --run")
  }
}

if (process.argv.includes("--subscriptions")) {
  const stripeClient = new Stripe(key, { apiVersion: "2025-02-24.acacia" })
  await migrateSubscriptions(stripeClient, items, fs.readFileSync(PRODUCTS_FILE, "utf8"), RUN)
  process.exit(0)
}

if (!RUN) {
  console.log("\nKuivaharjoitus — mitään ei luotu. Aja migraatio:  node stripe-live-migrate.mjs --run")
  process.exit(0)
}

// --- migrate -------------------------------------------------------------
const stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" })
let updated = source
const results = []

for (const item of items) {
  if (!item.testPriceId) continue

  // Idempotency: reuse a live product created by an earlier run.
  const existing = await stripe.products.search({
    query: `metadata['slug']:'${item.slug}' AND active:'true'`,
    limit: 1,
  })

  let product = existing.data[0]
  if (!product) {
    product = await stripe.products.create({
      name: item.name,
      metadata: { slug: item.slug },
      ...(item.image ? { images: [item.image] } : {}),
    })
  }

  // Reuse an existing live price only if the amount still matches.
  let livePriceId = null
  if (typeof product.default_price === "string") {
    const dp = await stripe.prices.retrieve(product.default_price)
    if (dp.active && dp.currency === "eur" && dp.unit_amount === item.amount) {
      livePriceId = dp.id
    }
  }
  if (!livePriceId) {
    const created = await stripe.prices.create({
      product: product.id,
      unit_amount: item.amount,
      currency: "eur",
    })
    await stripe.products.update(product.id, { default_price: created.id })
    livePriceId = created.id
  }

  if (!updated.includes(item.testPriceId)) {
    fail(`Vanhaa ID:tä ${item.testPriceId} ei löydy enää lähdekoodista (slug ${item.slug})`)
  }
  updated = updated.replace(item.testPriceId, livePriceId)
  results.push({ slug: item.slug, from: item.testPriceId, to: livePriceId })
  console.log(`✓ ${item.slug} → ${livePriceId}`)
}

fs.writeFileSync(PRODUCTS_FILE, updated)
console.log(`\nValmis: ${results.length} hintaa migratoitu, ${PRODUCTS_FILE} päivitetty.`)
console.log("Tarkista diff (git diff lib/products.ts), sitten commit + push.")
