import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ShieldCheck, MapPin, FileSearch, Ban, Leaf, Microscope } from "lucide-react"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "qualityPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function LaatuPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "qualityPage" })

  const certifications = [
    { icon: ShieldCheck, title: t("c1Title"), desc: t("c1Desc") },
    { icon: MapPin, title: t("c2Title"), desc: t("c2Desc") },
    { icon: FileSearch, title: t("c3Title"), desc: t("c3Desc") },
    { icon: Ban, title: t("c4Title"), desc: t("c4Desc") },
    { icon: Leaf, title: t("c5Title"), desc: t("c5Desc") },
    { icon: Microscope, title: t("c6Title"), desc: t("c6Desc") },
  ]

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-tight text-balance">{t("title")}</h1>
          <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed text-pretty">{t("subtitle")}</p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certifications.map((c) => (
              <div key={c.title} className="bg-card rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-5">
                  <c.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground">{c.title}</h3>
                <p className="mt-2 text-foreground/80 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
