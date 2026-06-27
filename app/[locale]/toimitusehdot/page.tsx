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
    title: `${t("shippingTitle")} | Robust Nordic`,
    description: t("shippingMeta"),
  }
}

export default async function ToimitusehdotPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "legal" })
  return (
    <LegalPage
      eyebrow={t("eyebrowCustomerService")}
      title={t("shippingTitle")}
      intro={t("shippingIntro")}
      content={getPolicyContent("shipping", locale)}
    />
  )
}
