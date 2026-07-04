import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/scroll-effects"
import { getFeaturedProducts } from "@/lib/products"
import type { Locale } from "@/i18n/routing"

export async function ProductsSection() {
  const t = await getTranslations("home.products")
  const locale = (await getLocale()) as Locale
  const featured = getFeaturedProducts(locale)

  return (
    <section id="tuotteet" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground text-balance">
            {t("titleA")} <span className="italic">{t("titleEm")}</span>
          </h2>
        </Reveal>

        {/* Products grid – 4 featured */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {featured.map((product, index) => (
            <Reveal key={product.slug} delay={index * 90} className="flex flex-col [&>a]:flex-1">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base tracking-wide border-foreground/20 hover:bg-foreground/5 bg-transparent"
          >
            <Link href="/tuotteet">
              {t("viewAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
