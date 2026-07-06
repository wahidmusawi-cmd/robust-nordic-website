"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { X, Minus, Plus, Trash2, ShoppingBag, RefreshCw } from "lucide-react"
import { useCart, priceToCents, unitCents } from "@/lib/cart"
import { getProduct } from "@/lib/products"

// Server error codes → cart namespace message keys.
const ERROR_KEYS: Record<string, string> = {
  MIXED_INTERVALS: "mixedIntervals",
  SUBSCRIPTION_UNAVAILABLE: "subscriptionUnavailable",
}

export function CartDrawer() {
  const t = useTranslations("cart")
  const locale = useLocale()
  const { items, removeItem, updateQuantity, clearCart, subtotal, isOpen, setIsOpen, itemCount } =
    useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Basic dialog behavior: focus lands on the close button, Escape closes.
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, setIsOpen])

  const formatPrice = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n)

  async function handleCheckout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
            isSubscription: i.purchaseType === "subscription",
            intervalDays: i.intervalDays,
          })),
          locale,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        const key = ERROR_KEYS[data.error as string]
        setError(key ? t(key) : t("checkoutFailed"))
        setLoading(false)
      }
    } catch {
      setError(t("networkError"))
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-foreground">
              {t("title")}{" "}
              {itemCount > 0 && <span className="text-muted-foreground">({itemCount})</span>}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={() => setIsOpen(false)}
            aria-label={t("close")}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p>{t("empty")}</p>
            </div>
          ) : (
            items.map((item) => {
              // Resolve fresh, locale-correct name/image/price by slug —
              // stored values are only a fallback (e.g. removed products).
              const live = getProduct(item.slug, locale)
              const name = live?.name ?? item.name
              const image = live?.image ?? item.image
              const price = live?.price ?? item.price
              // Cent-exact math — matches what Stripe actually charges.
              const base = priceToCents(price) / 100
              const unit = unitCents(price, item.purchaseType) / 100
              return (
                <div
                  key={`${item.slug}-${item.purchaseType}-${item.intervalDays}`}
                  className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground leading-tight truncate">
                      {name}
                    </p>
                    {item.purchaseType === "subscription" ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <RefreshCw className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent">
                          {t("subscription")} · {t("everyNDays", { days: item.intervalDays })}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">{t("oneTime")}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.slug, item.purchaseType, item.quantity - 1, item.intervalDays)}
                          aria-label="−1"
                          className="w-6 h-6 rounded flex items-center justify-center bg-background border border-border hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.purchaseType, item.quantity + 1, item.intervalDays)}
                          aria-label="+1"
                          className="w-6 h-6 rounded flex items-center justify-center bg-background border border-border hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {formatPrice(unit * item.quantity)}
                          </p>
                          {item.purchaseType === "subscription" && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(base * item.quantity)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.slug, item.purchaseType, item.intervalDays)}
                          aria-label={t("remove")}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("total")}</span>
              <span className="text-xl font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">{t("vatNote")}</p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold tracking-wide hover:bg-accent transition-colors disabled:opacity-60"
            >
              {loading ? t("checkingOut") : t("checkout").toUpperCase()}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("clear")}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
