import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { blogArticles, getBlogArticle, getBlogArticles } from "@/lib/blog"
import { routing } from "@/i18n/routing"
import { ArticleView } from "@/components/article-view"
import { ArticleCard } from "@/components/article-card"

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => blogArticles.map((a) => ({ locale, slug: a.slug })))
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "blogPage" })
  const article = getBlogArticle(slug, locale as "fi" | "sv" | "en")
  if (!article) return { title: t("articleNotFound") }
  return {
    title: `${article.title} | Robust Nordic`,
    description: article.desc,
    openGraph: { images: [article.img] },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const loc = locale as "fi" | "sv" | "en"
  const t = await getTranslations({ locale, namespace: "blogPage" })
  const article = getBlogArticle(slug, loc)
  if (!article) notFound()

  const related = getBlogArticles(loc)
    .filter((a) => a.slug !== slug)
    .slice(0, 3)

  return (
    <main className="bg-background">
      <ArticleView article={article} backHref="/blogi" backLabel={t("backToBlog")} eyebrow={t("eyebrow")} />

      {/* Related */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-foreground mb-10">{t("readAlso")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} basePath="/blogi" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
