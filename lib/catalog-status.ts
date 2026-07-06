// Sold-out state for catalog products. Source of truth is the live Stripe
// product metadata (soldOut: "true"), so no database is needed and the admin
// toggle takes effect storewide via tag revalidation.

import { unstable_cache, updateTag } from "next/cache"
import { getStripe } from "@/lib/admin/stripe"

export const SOLD_OUT_TAG = "sold-out"

export const getSoldOutSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const stripe = getStripe()
    if (!stripe) return [] // demo mode: nothing is sold out
    const slugs: string[] = []
    for await (const product of stripe.products.list({ limit: 100, active: true })) {
      if (product.metadata?.soldOut === "true" && product.metadata?.slug) {
        slugs.push(product.metadata.slug)
      }
    }
    return slugs
  },
  ["sold-out-slugs"],
  { tags: [SOLD_OUT_TAG], revalidate: 300 },
)

/** Flips the flag in Stripe and refreshes every page that reads it. */
export async function setSoldOut(slug: string, soldOut: boolean): Promise<void> {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe is not configured")
  const found = await stripe.products.search({
    query: `metadata['slug']:'${slug}' AND active:'true'`,
    limit: 1,
  })
  const product = found.data[0]
  if (!product) throw new Error(`Product not found in Stripe: ${slug}`)
  await stripe.products.update(product.id, {
    metadata: { soldOut: soldOut ? "true" : "" },
  })
  // Called from a server action — expires the tag with read-your-writes.
  updateTag(SOLD_OUT_TAG)
}
