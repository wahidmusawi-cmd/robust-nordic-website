import { NextRequest, NextResponse } from "next/server"
import { products } from "@/lib/products"
import { getStripe } from "@/lib/admin/stripe"

export async function POST(req: NextRequest) {
  try {
    // Lazy init so a missing key fails the request, not the whole build.
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const { slug, locale = "fi", quantity = 1 } = await req.json()

    const product = products.find((p) => p.slug === slug)
    if (!product || !product.stripePriceId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://robust-nordic-website.vercel.app"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: product.stripePriceId,
          quantity,
        },
      ],
      success_url: `${origin}/${locale}/tilaus/kiitos?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/tuotteet/${slug}`,
      locale: locale === "fi" ? "fi" : locale === "sv" ? "sv" : "en",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["FI", "SE", "EE", "DE", "DK", "NO"],
      },
      metadata: {
        slug,
        locale,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err)
    const message = err instanceof Error ? err.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
