import { NextRequest, NextResponse } from "next/server"
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  products,
  shippingRecurringPriceIds,
  subUnitCents,
} from "@/lib/products"
import { getStripe } from "@/lib/admin/stripe"
import { getSoldOutSlugs } from "@/lib/catalog-status"

interface CheckoutItem {
  slug: string
  quantity: number
  isSubscription: boolean
  intervalDays?: number
}

const ALLOWED_COUNTRIES: Array<"FI" | "SE" | "EE" | "DE" | "DK" | "NO"> = [
  "FI", "SE", "EE", "DE", "DK", "NO",
]

export async function POST(req: NextRequest) {
  try {
    // Lazy init so a missing key fails the request, not the whole build.
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const body = await req.json()
    const locale: string = body.locale ?? "fi"

    // Both the cart ({ items: [...] }) and the legacy single-product
    // ({ slug, quantity }) request shapes are supported.
    const items: CheckoutItem[] = Array.isArray(body.items)
      ? body.items
      : [{ slug: body.slug, quantity: body.quantity ?? 1, isSubscription: false }]

    if (!items.length) {
      return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 })
    }

    // Machine-readable error codes — the cart drawer maps them to
    // localized messages.
    const resolvedItems = []
    for (const item of items) {
      const product = products.find((p) => p.slug === item.slug)
      if (!product?.stripePriceId) {
        console.error("Checkout: unknown product", item.slug)
        return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 400 })
      }
      resolvedItems.push({ item, product })
    }

    const soldOutSlugs = new Set(await getSoldOutSlugs())
    if (resolvedItems.some(({ product }) => soldOutSlugs.has(product.slug))) {
      return NextResponse.json({ error: "PRODUCT_SOLD_OUT" }, { status: 400 })
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://robustnordic.fi"
    const localeParam = locale === "fi" ? ("fi" as const) : locale === "sv" ? ("sv" as const) : ("en" as const)
    const successUrl = `${origin}/${locale}/tilaus/kiitos?session_id={CHECKOUT_SESSION_ID}`

    const subItems = resolvedItems.filter(({ item }) => item.isSubscription)

    if (subItems.length > 0) {
      // One Stripe subscription has a single billing interval — all
      // subscription lines must agree on it.
      const intervals = new Set(subItems.map(({ item }) => item.intervalDays ?? 30))
      if (intervals.size > 1) {
        return NextResponse.json({ error: "MIXED_INTERVALS" }, { status: 400 })
      }
      const intervalDays = String([...intervals][0])

      // Recurring prices are created by stripe-live-migrate.mjs --subscriptions.
      const missing = subItems.filter(
        ({ product }) => !product.stripeSubscriptionPriceIds?.[intervalDays],
      )
      if (missing.length > 0) {
        console.error(
          "Missing subscription prices for:",
          missing.map(({ product }) => product.slug).join(", "),
        )
        return NextResponse.json({ error: "SUBSCRIPTION_UNAVAILABLE" }, { status: 400 })
      }

      // Shipping: Stripe has no shipping_options in subscription mode, so
      // under the free-shipping threshold a recurring shipping price is
      // added as its own line (renews with every delivery).
      const periodTotalCents = subItems.reduce(
        (sum, { item, product }) => sum + subUnitCents(product.price) * item.quantity,
        0,
      )
      const needsShipping = periodTotalCents < FREE_SHIPPING_THRESHOLD_CENTS
      const shippingPriceId = shippingRecurringPriceIds[intervalDays]
      if (needsShipping && !shippingPriceId) {
        console.error("Missing recurring shipping price for interval", intervalDays)
        return NextResponse.json({ error: "SUBSCRIPTION_UNAVAILABLE" }, { status: 400 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          ...resolvedItems.map(({ item, product }) => ({
            // One-time items ride along in subscription mode with their
            // regular price; subscription items use the recurring price.
            price: item.isSubscription
              ? product.stripeSubscriptionPriceIds![intervalDays]
              : product.stripePriceId,
            quantity: item.quantity,
          })),
          ...(needsShipping ? [{ price: shippingPriceId, quantity: 1 }] : []),
        ],
        success_url: successUrl,
        cancel_url: `${origin}/${locale}/tuotteet`,
        locale: localeParam,
        allow_promotion_codes: true,
        shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
        subscription_data: {
          metadata: {
            locale,
            intervalDays,
            slugs: subItems.map(({ product }) => product.slug).join(","),
          },
        },
        metadata: { locale, type: "subscription" },
      })
      return NextResponse.json({ url: session.url })
    }

    // One-time payment
    // payment_method_types is intentionally omitted — Stripe automatically
    // shows all methods enabled in the dashboard (card, MobilePay, Klarna,
    // Finnish bank transfers, Apple Pay, Google Pay, etc.).
    const firstSlug = resolvedItems[0]?.product.slug ?? ""
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolvedItems.map(({ item, product }) => ({
        price: product.stripePriceId,
        quantity: item.quantity,
      })),
      success_url: successUrl,
      cancel_url: `${origin}/${locale}/tuotteet/${firstSlug}`,
      locale: localeParam,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
      metadata: { locale, slug: firstSlug, type: "one_time" },
    })
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err)
    const message = err instanceof Error ? err.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
