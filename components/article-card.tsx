"use client"

import { useLocale, useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { type Article, formatDate } from "@/lib/blog"

export function ArticleCard({ article, basePath }: { article: Article; basePath: string }) {
  const locale = useLocale()
  const t = useTranslations("card")
  return (
    <Link
      href={`${basePath}/${article.slug}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.img || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          {formatDate(article.date, locale)} · {article.readingTime} {t("minRead")}
        </p>
        <h3 className="font-serif text-xl text-foreground mt-2 leading-snug text-balance group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3 flex-1">{article.desc}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-4">
          {t("readMore")}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
