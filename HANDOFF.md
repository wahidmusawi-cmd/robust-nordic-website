# Robust Nordic — Handoff for Shopify Integration

This document is written for the next AI/developer (Claude) who will make this
site Shopify-compatible and deploy it. It explains exactly how the project is
built, where data lives, and what needs to change for Shopify.

---

## 1. What this project is

A trilingual (Finnish / Swedish / English) **marketing + content site** for
Robust Nordic, a Nordic supplement brand. It is built with **Next.js 16 (App
Router)** and **Tailwind CSS v4**.

**Important:** Today this is NOT a real storefront. Product data is hardcoded,
and every "Buy" button links OUT to the live Shopify store at
`robustnordic.fi`. There is no cart, no checkout, and no Shopify API call in
this codebase yet. The Shopify work is about replacing that hardcoded/linkout
layer with a real storefront integration.

---

## 2. Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16, App Router, React Server Components    |
| Styling        | Tailwind CSS v4 (`@import "tailwindcss"`, `@theme` in `app/globals.css`) |
| i18n           | `next-intl` with locale-prefixed routing           |
| Fonts          | `next/font/google` — Inter (sans) + Instrument Serif (headings), centralized in `lib/fonts.ts` |
| UI primitives  | shadcn/ui (only what's in `components/ui/`)         |
| Package manager| pnpm                                               |

---

## 3. Internationalization (read this before touching routes)

i18n is the backbone of the site. Do NOT bypass it.

- **Locales:** `fi` (default), `sv`, `en` — defined in `i18n/routing.ts`.
- **URL strategy:** `localePrefix: "as-needed"`. Finnish is unprefixed
  (`/tuotteet`), Swedish/English are prefixed (`/sv/tuotteet`, `/en/tuotteet`).
- **Middleware:** `proxy.ts` (Next.js 16 renamed `middleware` → `proxy`) runs
  `next-intl` middleware on all non-asset routes.
- **Request config:** `i18n/request.ts` loads the right message catalog.
- **Navigation:** ALWAYS import `Link`, `useRouter`, `redirect`, etc. from
  `@/i18n/navigation` (locale-aware) — never from `next/link` or
  `next/navigation`.
- **UI strings:** live in `messages/{fi,sv,en}.json`, namespaced per
  page/section (e.g. `nav`, `hero`, `productsPage`, `quiz`, `legal`).
  - Server components: `getTranslations("namespace")`.
  - Client components: `useTranslations("namespace")` + `useLocale()`.

All routes live under `app/[locale]/`. The route segment folder names are in
Finnish (`tuotteet`, `blogi`, `yhteystiedot`, etc.) for all locales — only the
content is translated, not the slugs.

### Routes
```
app/[locale]/page.tsx                      Home
app/[locale]/tuotteet/page.tsx             Product listing
app/[locale]/tuotteet/[slug]/page.tsx      Product detail
app/[locale]/loyda-tuotteesi/page.tsx      Wellness quiz (product finder)
app/[locale]/laatu-ja-luottamus/page.tsx   Quality & trust
app/[locale]/meista/page.tsx               About
app/[locale]/tarinamme/page.tsx            Our story
app/[locale]/yhteystiedot/page.tsx         Contact
app/[locale]/ukk/page.tsx                  FAQ
app/[locale]/blogi/page.tsx + [slug]       Blog
app/[locale]/sponsoritarinat/page.tsx + [slug]   Sponsor stories
app/[locale]/{tietosuoja,toimitusehdot,maksutavat,kopvillkor}/page.tsx   Legal
```

---

## 4. Data layer (THIS is what Shopify replaces)

All "content" data is local TypeScript/JSON, with translations split out and a
Finnish fallback. Each domain has a `*-data`/main file + a `*-translations` file
plus accessor functions that take a `locale`.

| File                          | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `lib/products.ts`             | **Hardcoded product catalog** (17 products): slug, name, price string, image (Shopify CDN URL), category, benefits, usage, color. Accessors: `getAllProducts(locale)`, `getProduct(slug, locale)`, `getRelatedProducts`, `getFeaturedProducts`. |
| `lib/product-translations.ts` | SV/EN copy per product slug.                                            |
| `lib/products.ts` → `getBuyUrl(slug)` | **The current "checkout".** Maps each slug to a live `robustnordic.fi/products/<handle>` URL via the `liveHandles` map. Buy buttons just link there. |
| `lib/blog.ts` + `blog-data.json` + `blog-translations.ts` | Blog & sponsor articles. |
| `lib/quiz.ts`                 | Wellness quiz: scoring logic keyed by stable question/option IDs. Labels come from `messages.*.quiz`. Maps answers → recommended product slugs. |
| `lib/policies.ts` + `policies-data.json` + `policy-translations.ts` | Legal page bodies. |
| `lib/fonts.ts`                | Centralized font config. Swap `ACTIVE` to change fonts site-wide.       |

### Product shape (current)
```ts
type Product = {
  slug: string
  name: string
  shortName: string
  size?: string
  price: string            // e.g. "36,90" (string, comma decimal, no currency)
  image: string            // currently a Shopify CDN URL
  category: "ravintolisat" | "hyvinvointi"
  tagline: string
  description: string
  benefits: string[]
  ingredients?: string
  usage?: string
  badge?: string           // e.g. "Suosittu" / "Uutuus"
  productColor: string     // hex, used for theming the product card/detail
}
```

---

## 5. What "make it Shopify-compatible" can mean — pick one

There are three realistic target architectures. **Confirm with the store owner
which one they want** before building, because they diverge a lot:

### Option A — Keep this Next.js app, add Shopify as a headless backend (recommended)
Use the **Shopify Storefront API** (GraphQL) to fetch products and run a real
cart + checkout, while keeping all the custom design, i18n, blog, and quiz.
- Replace `lib/products.ts` hardcoded array with Storefront API queries.
  Keep the SAME accessor function signatures (`getAllProducts(locale)`,
  `getProduct(slug, locale)`, …) so pages don't need to change.
- Map Shopify product `handle` → existing `slug` (the `liveHandles` map in
  `lib/products.ts` already documents this mapping).
- Use Shopify's translated content (Markets / `@inContext(language:)`) for
  SV/EN instead of `product-translations.ts`, OR keep local translations.
- Replace `getBuyUrl()` linkout with add-to-cart → Shopify cart → checkout URL.
- Env vars needed: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
- Deploy on Vercel.

### Option B — Rebuild as a Shopify Hydrogen + Oxygen storefront
Shopify's official React framework. Highest fidelity to Shopify's commerce
features but means porting all pages/components into Hydrogen's structure
(Remix-based) and deploying on Oxygen, not Vercel. Most work.

### Option C — Convert to a Shopify Liquid theme
Rebuild the design as a classic Shopify theme (Liquid templates, sections).
Native to Shopify admin/theming, but loses the Next.js/React architecture and
the custom i18n approach entirely. Effectively a rewrite.

**Recommendation:** Option A. It preserves everything already built (design,
trilingual content, blog, quiz, legal) and only swaps the data/checkout layer.

---

## 6. Concrete migration checklist (for Option A)

1. **Connect Shopify Storefront API.** Add `SHOPIFY_STORE_DOMAIN` and
   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Create a small GraphQL client in
   `lib/shopify.ts`.
2. **Map locales → Shopify languages/markets.** `fi`→primary, `sv`/`en` via
   `@inContext`. Decide whether to keep `lib/product-translations.ts` or pull
   translated product copy from Shopify.
3. **Reimplement `lib/products.ts` accessors against the API**, preserving
   their signatures and the `Product` type (or extend it with `variantId`,
   `availableForSale`, currency, compare-at price). Pages/components import
   only the accessors, so keeping signatures stable minimizes churn.
4. **Add a cart.** Storefront API `cart` mutations + a cart context/drawer.
   Replace the `getBuyUrl()` linkout in product cards/detail and the quiz
   results with real add-to-cart.
5. **Checkout.** Send users to the Shopify-hosted `checkoutUrl` from the cart.
   If running inside an iframe/preview, open checkout in a new tab.
6. **Prices.** Current prices are display-only strings (`"36,90"`). Switch to
   Shopify money objects and format per locale (`fi-FI`/`sv-SE`/`en` + EUR).
7. **Images.** Currently Shopify CDN URLs already — fine to keep, but ideally
   come from the product query so they stay in sync.
8. **Blog/quiz/legal/static pages.** No change needed; they are content-only.
   (Optionally move blog to Shopify blogs later.)
9. **SEO/metadata.** Each page already sets localized `metadata`. Keep this;
   add product structured data (JSON-LD) if desired.

### Files you will MOST LIKELY touch
- `lib/products.ts` (rewrite internals, keep API)
- `lib/product-translations.ts` (maybe remove if using Shopify translations)
- `components/product-card.tsx`, `app/[locale]/tuotteet/[slug]/page.tsx`,
  `components/wellness-quiz.tsx` (swap buy-linkout → add-to-cart)
- NEW: `lib/shopify.ts`, cart context + cart drawer component
- `.env` (Shopify credentials)

### Files you should NOT need to touch
- `i18n/*`, `proxy.ts`, `messages/*.json` (except adding cart/checkout strings)
- All static/content pages and their components
- `lib/quiz.ts` scoring logic (only its product lookups go through the new API)

---

## 7. Gotchas / project conventions

- **Next.js 16:** `params`, `searchParams`, `headers`, `cookies` are async —
  always `await` them. Middleware file is `proxy.ts`, not `middleware.ts`.
- **Locale-aware navigation only:** import from `@/i18n/navigation`.
- **Finnish is the fallback** everywhere — every translation accessor returns
  Finnish if a SV/EN entry is missing.
- **Route folder names are Finnish** for all locales; don't translate slugs.
- **Design tokens** are in `app/globals.css` (`@theme`). Use `font-sans` /
  `font-serif` classes; don't hardcode font families.
- **Fonts** are swapped in one place: `lib/fonts.ts` (`ACTIVE`).
- The `liveHandles` map in `lib/products.ts` is the authoritative
  slug → Shopify product-handle mapping; reuse it when wiring the API.

---

## 8. How to run

```bash
pnpm install
pnpm dev        # http://localhost:3000  (fi at /, sv at /sv, en at /en)
pnpm build      # production build
```
