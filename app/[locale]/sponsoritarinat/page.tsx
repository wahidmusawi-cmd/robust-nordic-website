import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getSponsorStories } from "@/lib/blog"
import { ArticleCard } from "@/components/article-card"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "sponsorPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default async function SponsorStoriesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "sponsorPage" })
  const stories = getSponsorStories(locale as "fi" | "sv" | "en")

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h1 className="font-serif text-5xl sm:text-6xl leading-tight text-balance max-w-3xl">{t("title")}</h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl leading-relaxed">{t("subtitle")}</p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <ArticleCard key={story.slug} article={story} basePath="/sponsoritarinat" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
