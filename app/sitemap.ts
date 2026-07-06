import type { MetadataRoute } from "next"
import { products } from "@/lib/products"
import blogData from "@/lib/blog-data.json"

const DOMAINS = {
  fi: "https://robustnordic.fi",
  sv: "https://robustnordic.se",
  en: "https://robustnordic.com",
} as const

// Info pages share Finnish path segments across locales by design.
const STATIC_PAGES = [
  "loyda-tuotteesi",
  "laatu-ja-luottamus",
  "meista",
  "tarinamme",
  "yhteystiedot",
  "ukk",
  "sponsoritarinat",
]

function productSegment(locale: string) {
  return locale === "en" ? "products" : locale === "sv" ? "produkter" : "tuotteet"
}
function blogSegment(locale: string) {
  return locale === "en" ? "blog" : locale === "sv" ? "blogg" : "blogi"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const [locale, base] of Object.entries(DOMAINS)) {
    const prod = productSegment(locale)
    const blog = blogSegment(locale)

    entries.push({ url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 })
    entries.push({ url: `${base}/${prod}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 })
    entries.push({ url: `${base}/${blog}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 })

    for (const page of STATIC_PAGES) {
      entries.push({ url: `${base}/${page}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 })
    }
    for (const p of products) {
      entries.push({
        url: `${base}/${prod}/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }
    for (const article of blogData.blog) {
      entries.push({
        url: `${base}/${blog}/${article.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  }
  return entries
}
