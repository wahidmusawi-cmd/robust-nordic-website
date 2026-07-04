import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/scroll-effects"
import { getAllProducts } from "@/lib/products"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "productsPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("productsPage")
  const all = getAllProducts(locale)
  const ravintolisat = all.filter((p) => p.category === "ravintolisat")
  const hyvinvointi = all.filter((p) => p.category === "hyvinvointi")

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance">
            {t("titleA")} <span className="italic">{t("titleEm")}</span> {t("titleB")}
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto text-pretty">{t("subtitle")}</p>
        </div>
      </section>

      {/* Ravintolisät */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">{t("supplements")}</h2>
            <span className="text-sm text-muted-foreground">
              {ravintolisat.length} {t("countSuffix")}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {ravintolisat.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 4) * 80} className="flex flex-col [&>a]:flex-1">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hyvinvointituotteet */}
      <section className="pb-20 lg:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">{t("wellbeing")}</h2>
            <span className="text-sm text-muted-foreground">
              {hyvinvointi.length} {t("countSuffix")}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {hyvinvointi.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 4) * 80} className="flex flex-col [&>a]:flex-1">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
