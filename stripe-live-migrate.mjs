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
