"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { RefreshCw, ShoppingCart, Minus, Plus, Check } from "lucide-react"
import { useCart, priceToCents, subUnitCents, type PurchaseType } from "@/lib/cart"
import type { Product } from "@/lib/products"

const INTERVALS = [30, 60, 90]

export function AddToCartSection({ product }: { product: Product }) {
  const t = useTranslations("cart")
  const locale = useLocale()
  const { addItem } = useCart()
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("one_time")
  const [quantity, setQuantity] = useState(1)
  const [intervalDays, setIntervalDays] = useState(30)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n)
  // Cent-exact, same rounding as the Stripe recurring prices.
  const basePrice = priceToCents(product.price) / 100
  const subPrice = fmt(subUnitCents(product.price) / 100)
  const displayPrice = purchaseType === "subscription" ? subPrice : fmt(basePrice)

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      purchaseType,
      intervalDays,
      quantity,
    })
    setAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Purchase type toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl">
        <button
          onClick={() => setPurchaseType("one_time")}
          aria-pressed={purchaseType === "one_time"}
          className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
            purchaseType === "one_time"
              ? "bg-background shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("oneTime")}
          <span className="block text-xs font-normal mt-0.5 opacity-70">{fmt(basePrice)}</span>
        </button>
        <button
          onClick={() => setPurchaseType("subscription")}
          aria-pressed={purchaseType === "subscription"}
          className={`py-3 px-4 rounded-lg text-sm font-medium transition-all relative ${
            purchaseType === "subscription"
              ? "bg-background shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="absolute -top-2 right-2 bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold">
            -15%
          </span>
          <div className="flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            {t("subscription")}
          </div>
          <span className="block text-xs font-normal mt-0.5">
            <span className="opacity-70">{subPrice}</span>
            <span className="line-through opacity-40 ml-1">{fmt(basePrice)}</span>
          </span>
        </button>
      </div>

      {/* Subscription interval */}
      {purchaseType === "subscription" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("interval")}</p>
          <div className="flex gap-2">
            {INTERVALS.map((d) => (
              <button
                key={d}
                onClick={() => setIntervalDays(d)}
                aria-pressed={intervalDays === d}
                className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                  intervalDays === d
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {t("intervalDays", { days: d })}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t("intervalNote")}</p>
        </div>
      )}

      {/* Quantity + Add */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="−1"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-background transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            aria-label="+1"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-background transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all ${
            added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-accent"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              {t("added")}
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {t("addToCart").toUpperCase()} — {displayPrice}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
