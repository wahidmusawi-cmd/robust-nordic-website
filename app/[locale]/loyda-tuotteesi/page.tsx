import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { WellnessQuiz } from "@/components/wellness-quiz"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "quiz" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function LoydaTuotteesiPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="bg-background min-h-screen">
      <section className="pt-32 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WellnessQuiz />
        </div>
      </section>
    </main>
  )
}
