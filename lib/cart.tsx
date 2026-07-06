"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

export type PurchaseType = "one_time" | "subscription"

export type CartItem = {
  slug: string
  name: string
  price: string
  image: string
  quantity: number
  purchaseType: PurchaseType
  intervalDays: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (slug: string, purchaseType: PurchaseType, intervalDays?: number) => void
  updateQuantity: (
    slug: string,
    purchaseType: PurchaseType,
    quantity: number,
    intervalDays?: number,
  ) => void
  clearCart: () => void
  itemCount: number
  /** Cart total in euros, computed from per-line cent amounts. */
  subtotal: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

// Canonical money math lives in lib/products.ts so the checkout route (server)
// and this client module can never diverge.
export { SUBSCRIPTION_DISCOUNT, subUnitCents } from "@/lib/products"
import { getProduct, subUnitCents } from "@/lib/products"

export const STORAGE_KEY = "rn_cart_v1"

export function priceToCents(price: string): number {
  return Math.round(parseFloat(price.replace(",", ".")) * 100)
}

export function unitCents(price: string, purchaseType: PurchaseType): number {
  return purchaseType === "subscription" ? subUnitCents(price) : priceToCents(price)
}

/** Subscriptions with different delivery intervals are separate cart lines. */
function isSameLine(a: CartItem, slug: string, purchaseType: PurchaseType, intervalDays?: number) {
  if (a.slug !== slug || a.purchaseType !== purchaseType) return false
  return purchaseType === "one_time" || intervalDays === undefined || a.intervalDays === intervalDays
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Persist across reloads and locale switches (each locale is a full
  // navigation). Loaded after mount so SSR markup stays stable.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // corrupt storage — start fresh
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable (private mode etc.) — cart still works in-memory
    }
  }, [items])

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) =>
          isSameLine(i, newItem.slug, newItem.purchaseType, newItem.intervalDays),
        )
        if (existing) {
          return prev.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) } : i,
          )
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }]
      })
      setIsOpen(true)
    },
    [],
  )

  const removeItem = useCallback(
    (slug: string, purchaseType: PurchaseType, intervalDays?: number) => {
      setItems((prev) => prev.filter((i) => !isSameLine(i, slug, purchaseType, intervalDays)))
    },
    [],
  )

  const updateQuantity = useCallback(
    (slug: string, purchaseType: PurchaseType, quantity: number, intervalDays?: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => !isSameLine(i, slug, purchaseType, intervalDays)))
      } else {
        setItems((prev) =>
          prev.map((i) => (isSameLine(i, slug, purchaseType, intervalDays) ? { ...i, quantity } : i)),
        )
      }
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const subtotalCents = items.reduce((sum, i) => {
    // Live catalog price wins over the stored add-time price, matching the
    // per-line rendering in the drawer.
    const price = getProduct(i.slug)?.price ?? i.price
    return sum + unitCents(price, i.purchaseType) * i.quantity
  }, 0)
  const subtotal = subtotalCents / 100

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
