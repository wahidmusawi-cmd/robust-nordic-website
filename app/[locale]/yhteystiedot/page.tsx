import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Mail, Phone, Clock, MapPin } from "lucide-react"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contactPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function YhteystiedotPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "contactPage" })

  const contacts = [
    { icon: Mail, label: t("emailLabel"), value: "asiakaspalvelu@robustnordic.fi", href: "mailto:asiakaspalvelu@robustnordic.fi" },
    { icon: Phone, label: t("phoneLabel"), value: "050 372 0007", href: "tel:+358503720007" },
    { icon: Clock, label: t("hoursLabel"), value: t("hoursValue") },
    { icon: MapPin, label: t("locationLabel"), value: t("locationValue") },
  ]

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="pt-32 pb-14 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">{t("title")}</h1>
          <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed text-pretty">{t("subtitle")}</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {contacts.map((c) => (
              <div key={c.label} className="bg-card rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-5">
                  <c.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm tracking-wide text-muted-foreground uppercase">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="block mt-1 text-lg font-medium text-foreground hover:text-accent transition-colors break-words">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1 text-lg font-medium text-foreground">{c.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Company info */}
          <div className="mt-10 bg-secondary rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-foreground">{t("companyTitle")}</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              Robust Nordic Ab<br />
              {t("companyAddress")}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
