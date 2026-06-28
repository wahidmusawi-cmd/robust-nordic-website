"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"

interface BuyButtonProps {
  slug: string
  locale: string
  label?: string
  size?: "default" | "sm" | "lg"
  className?: string
}

export function BuyButton({ slug, locale, label, size = "lg", className }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, locale }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout error:", data.error)
        setLoading(false)
      }
    } catch (err) {
      console.error("Checkout failed:", err)
      setLoading(false)
    }
  }

  const defaultLabel =
    locale === "fi" ? "Osta nyt" : locale === "sv" ? "Köp nu" : "Buy now"

  return (
    <Button
      size={size}
      className={className}
      onClick={handleBuy}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {label ?? defaultLabel}
    </Button>
  )
}
