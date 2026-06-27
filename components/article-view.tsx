import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { type Article, formatDate } from "@/lib/blog"

export function ArticleView({
  article,
  backHref,
  backLabel,
  eyebrow,
}: {
  article: Article
  backHref: string
  backLabel: string
  eyebrow: string
}) {
  const t = useTranslations("articleView")
  const locale = useLocale()
  return (
    <article className="pt-28 pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
        <p className="text-sm tracking-[0.3em] text-accent mt-8 mb-4">{eyebrow}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
          {article.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-6">
          {formatDate(article.date, locale)} · {article.readingTime} {t("minRead")}
        </p>
      </div>

      {/* Hero image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.img || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="space-y-5">
          <ArticleBody body={article.body} />
        </div>
      </div>
    </article>
  )
}

function ArticleBody({ body }: { body: Article["body"] }) {
  const elements: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed">
          {listBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      )
      listBuffer = []
    }
  }

  body.forEach((block, i) => {
    if (block.t === "li") {
      listBuffer.push(block.c)
      return
    }
    flushList(`list-${i}`)
    if (block.t === "h2") {
      elements.push(
        <h2 key={i} className="font-serif text-2xl sm:text-3xl text-foreground pt-6 leading-snug text-balance">
          {block.c}
        </h2>,
      )
    } else if (block.t === "h3") {
      elements.push(
        <h3 key={i} className="font-sans font-semibold text-lg text-foreground pt-2">
          {block.c}
        </h3>,
      )
    } else {
      elements.push(
        <p key={i} className="text-foreground/80 leading-relaxed text-pretty">
          {block.c}
        </p>,
      )
    }
  })
  flushList("list-end")

  return <>{elements}</>
}
