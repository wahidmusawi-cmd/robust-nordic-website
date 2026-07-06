import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("card")
  const locale = useLocale()
  const currency = locale === "sv" ? "kr" : "€"
  const productSegment = locale === "en" ? "products" : locale === "sv" ? "produkter" : "tuotteet"
  return (
    <Link
      href={`/${productSegment}/${product.slug}`}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-secondary/40 flex items-center justify-center p-6">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] tracking-wider uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 lg:p-6 flex flex-col flex-1">
        <div className="flex-1">
          {product.size && (
            <p className="text-xs tracking-wider text-muted-foreground uppercase">{product.size}</p>
          )}
          <h3 className="font-sans font-semibold text-base text-foreground mt-1 leading-snug text-balance">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{product.tagline}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-lg font-semibold text-foreground">{product.price} {currency}</span>
          <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 gap-1 transition-all">
            {t("view")}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
