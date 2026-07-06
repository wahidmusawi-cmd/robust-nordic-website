"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart"

/**
 * Rendered on the thank-you page: emptying the cart after a completed
 * checkout prevents accidental duplicate orders (the header badge would
 * otherwise keep showing the just-paid items).
 */
export function ClearCartOnSuccess() {
  const { clearCart } = useCart()
  useEffect(() => {
    clearCart()
  }, [clearCart])
  return null
}
