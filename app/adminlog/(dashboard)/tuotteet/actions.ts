"use server"

import { revalidatePath } from "next/cache"
import { setSoldOut } from "@/lib/catalog-status"

export async function toggleSoldOutAction(slug: string, soldOut: boolean): Promise<{ error?: string }> {
  try {
    await setSoldOut(slug, soldOut)
    // Refresh the admin views; the storefront refreshes via the cache tag.
    revalidatePath("/adminlog/tuotteet")
    revalidatePath(`/adminlog/tuotteet/${slug}`)
    return {}
  } catch (err) {
    console.error("toggleSoldOut failed:", err)
    return { error: err instanceof Error ? err.message : "Tuntematon virhe" }
  }
}
