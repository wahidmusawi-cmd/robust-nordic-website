import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { Reveal } from "@/components/scroll-effects"
import { getBlogArticles } from "@/lib/blog"
import type { Locale } from "@/i18n/routing"

export async function TeamSection() {
  const t = await getTranslations("home.blog")
  const locale = (await getLocale()) as Locale
  const featured = getBlogArticles(locale).slice(0, 3)

  return (
    <section id="artikkelit" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
              {t("title")}
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="self-start md:self-auto px-8 py-6 text-base tracking-wide border-foreground/20 hover:bg-foreground/5 bg-transparent"
          >
            <Link href="/blogi">
              {t("viewMore")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Reveal>

        {/* Blog posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((article, index) => (
            <Reveal key={article.slug} delay={index * 100}>
              <ArticleCard article={article} basePath="/blogi" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
