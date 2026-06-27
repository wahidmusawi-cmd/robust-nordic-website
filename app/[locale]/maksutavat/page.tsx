import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { LegalPage } from "@/components/legal-page"
import type { ContentBlock } from "@/lib/policies"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "legal" })
  return {
    title: `${t("paymentTitle")} | Robust Nordic`,
    description: t("paymentMeta"),
  }
}

export default async function MaksutavatPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "legal" })

  const content: ContentBlock[] = [
    { t: "p", c: t("payment.intro") },
    { t: "h2", c: t("payment.cardsTitle") },
    { t: "p", c: t("payment.cardsText") },
    { t: "h2", c: t("payment.mobilepayTitle") },
    { t: "p", c: t("payment.mobilepayText") },
    { t: "h2", c: t("payment.banksTitle") },
    { t: "p", c: t("payment.banksText") },
    { t: "h2", c: t("payment.klarnaTitle") },
    { t: "p", c: t("payment.klarnaText") },
    { t: "h2", c: t("payment.securityTitle") },
    { t: "p", c: t("payment.securityText") },
    { t: "p", c: t("payment.contactText") },
  ]

  return (
    <LegalPage
      eyebrow={t("eyebrowCustomerService")}
      title={t("paymentTitle")}
      intro={t("paymentIntro")}
      content={content}
    />
  )
}
