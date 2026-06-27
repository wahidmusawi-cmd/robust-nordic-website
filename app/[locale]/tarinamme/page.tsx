import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "storyPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function TarinammePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "storyPage" })
  const tc = await getTranslations({ locale, namespace: "common" })

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-tight text-balance">{t("title")}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p1")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p2")}</p>

          <p className="font-serif text-2xl text-foreground py-2">{t("turningPoint")}</p>

          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p3")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p4")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p5")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p6")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">{t("p7")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-accent px-8 py-6 tracking-wide"
          >
            <Link href="/tuotteet">{tc("exploreProducts")}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
