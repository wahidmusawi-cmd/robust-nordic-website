import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { LegalPage } from "@/components/legal-page"
import { getPolicyContent } from "@/lib/policies"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "legal" })
  return {
    title: `${t("kopvillkorTitle")} | Robust Nordic`,
    description: t("kopvillkorMeta"),
  }
}

export default async function KopvillkorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "legal" })
  return (
    <LegalPage
      eyebrow={t("eyebrowTerms")}
      title={t("kopvillkorTitle")}
      intro={t("kopvillkorIntro")}
      content={getPolicyContent("payment")}
    />
  )
}
