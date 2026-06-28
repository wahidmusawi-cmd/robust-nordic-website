import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Check, ArrowLeft, Leaf, ShieldCheck, MapPin, Truck } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ProductCard } from "@/components/product-card"
import { BuyButton } from "@/components/buy-button"
import { products, getProduct, getRelatedProducts } from "@/lib/products"
import type { Locale } from "@/i18n/routing"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const product = getProduct(slug, locale)
  const t = await getTranslations({ locale, namespace: "productDetail" })
  if (!product) return { title: t("notFound") }
  return {
    title: `${product.name} | Robust Nordic`,
    description: product.description,
    openGraph: { images: [product.image] },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations("productDetail")
  const product = getProduct(slug, locale)
  if (!product) notFound()

  const related = getRelatedProducts(slug, 4, locale)

  const trustBadges = [
    { icon: MapPin, label: t("badgeMadeIn") },
    { icon: Leaf, label: t("badgeVeganGluten") },
    { icon: ShieldCheck, label: t("badgeCertified") },
    { icon: Truck, label: t("badgeShipping") },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          href="/tuotteet"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div
              className="aspect-square rounded-3xl flex items-center justify-center p-10 lg:p-16 sticky top-24"
              style={{ backgroundColor: `${product.productColor}1a` }}
            >
              {product.badge && (
                <span className="absolute top-5 left-5 text-xs tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase mb-3">{product.tagline}</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground leading-tight text-balance">
              {product.name}
            </h1>
            {product.size && <p className="mt-3 text-muted-foreground">{product.size}</p>}

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-foreground">{product.price} €</span>
              <span className="text-sm text-muted-foreground">{t("vat")}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-accent px-8 py-6 text-base tracking-wide flex-1"
              >
                <BuyButton slug={slug} locale={locale} label={t("buy")} size="lg" className="w-full" />
            </div>

            {/* Benefits */}
            <div className="mt-10">
              <h2 className="font-semibold text-foreground mb-4">{t("benefits")}</h2>
              <ul className="space-y-3">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </span>
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            {product.usage && (
              <div className="mt-8 p-5 rounded-2xl bg-secondary">
                <h2 className="font-semibold text-foreground mb-1 text-sm tracking-wide">{t("usageTitle")}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.usage}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-border">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <badge.icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24 lg:mt-32">
            <h2 className="font-serif text-3xl text-foreground mb-10">{t("related")}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
