import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "faqPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function UkkPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "faqPage" })

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
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

      {/* FAQ accordion */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-sans font-medium text-lg text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed text-base">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 bg-secondary rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl text-foreground">{t("ctaTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("ctaSubtitle")}</p>
            <Link
              href="/yhteystiedot"
              className="inline-flex items-center mt-5 px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm tracking-wide hover:bg-accent transition-colors"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
