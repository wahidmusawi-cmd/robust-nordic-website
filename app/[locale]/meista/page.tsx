import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "aboutPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function MeistaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "aboutPage" })
  const tc = await getTranslations({ locale, namespace: "common" })

  const values = [
    { title: t("value1Title"), desc: t("value1Desc") },
    { title: t("value2Title"), desc: t("value2Desc") },
    { title: t("value3Title"), desc: t("value3Desc") },
    { title: t("value4Title"), desc: t("value4Desc") },
  ]

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
        </div>
      </section>

      {/* Values */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-secondary rounded-2xl p-8">
                <h3 className="font-serif text-xl text-foreground">{v.title}</h3>
                <p className="mt-2 text-foreground/80 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent px-8 py-6 tracking-wide">
              <Link href="/tuotteet">{tc("exploreProducts")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
