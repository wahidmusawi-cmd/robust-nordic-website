import blogData from "./blog-data.json"
import { blogMetaI18n, sponsorMetaI18n, type LocalizedMeta } from "./blog-translations"

export type ContentBlock = { t: "h2" | "h3" | "p" | "li"; c: string }

export type Article = {
  slug: string
  title: string
  desc: string
  img: string
  body: ContentBlock[]
  date: string
  readingTime: number
}

type RawArticle = {
  slug: string
  title: string
  desc: string
  img: string
  body: ContentBlock[]
}

type Locale = "fi" | "sv" | "en"

// Siistityt suomenkieliset otsikot ja julkaisupäivät (haettu live-sivuilta)
const blogMeta: Record<string, { title: string; date: string }> = {
  "aivojen-ystava-ja-immuunijarjestelman-vahvistaja-tutustu-lions-mane-sienen-uskomattomiin-terveyshyotyihin": {
    title: "Aivojen ystävä ja immuunijärjestelmän vahvistaja: tutustu Lion's Mane -sieneen",
    date: "2024-06-09",
  },
  "reishi-sieni-itamainen-laakesieni-nykyaikaisen-hyvinvoinnin-tukena": {
    title: "Reishi-sieni – itämainen lääkesieni nykyaikaisen hyvinvoinnin tukena",
    date: "2024-06-09",
  },
  "chaga-sieni-luonnon-oma-superruoka": {
    title: "Chaga-sieni – luonnon oma superruoka",
    date: "2024-06-09",
  },
  "elokuu-ja-vitamiinivinkit": {
    title: "Elokuu ja vitamiinivinkit",
    date: "2024-08-09",
  },
  "iltarutiini-avain-levolliseen-uneen": {
    title: "Iltarutiini – avain levolliseen uneen",
    date: "2024-10-01",
  },
  "omega-3-krillioljy-kevaan-tehokas-tukija-hyvinvoinnille": {
    title: "Omega-3 Krilliöljy – kevään tehokas tukija hyvinvoinnille",
    date: "2025-02-20",
  },
  "quattro-magnesium-neljan-muodon-teho-yhdessa-kapselissa": {
    title: "Quattro Magnesium – neljän muodon teho yhdessä kapselissa",
    date: "2025-06-02",
  },
  "elokuu-uusi-alku-ihon-ja-nivelten-hyvinvoinnille": {
    title: "Elokuu – uusi alku ihon ja nivelten hyvinvoinnille",
    date: "2025-08-07",
  },
  "hyodynna-b12-n-taysi-teho-folaatti-tekee-sen-mahdolliseksi": {
    title: "Hyödynnä B12:n täysi teho – folaatti tekee sen mahdolliseksi",
    date: "2025-10-20",
  },
  "hiljaisempi-ilta-ei-aina-tarkoita-palautumista": {
    title: "Hiljaisempi ilta ei aina tarkoita palautumista",
    date: "2025-12-23",
  },
  "kesa-aurinko-ja-hyvinvointi-miksi-vitamiineista-kannattaa-huolehtia-myos-kesalla": {
    title: "Kesä, aurinko ja hyvinvointi – miksi vitamiineista kannattaa huolehtia myös kesällä",
    date: "2026-05-22",
  },
}

const sponsorMeta: Record<string, { title: string; date: string }> = {
  "aitajuoksija-mila-heikkonen": { title: "Aitajuoksija Mila Heikkonen", date: "2025-11-20" },
  "painija-tino-ojala": { title: "Painija Tino Ojala", date: "2025-11-10" },
  "painiseura-helsingin-haka": { title: "Painiseura Helsingin Haka", date: "2025-10-28" },
  "ammattinyrkkeilija-ilari-kujala": { title: "Ammattinyrkkeilijä Ilari Kujala", date: "2025-10-15" },
  "mma-ammattilainen-omar-tugarev": { title: "MMA-ammattilainen Omar Tugarev", date: "2025-10-01" },
}

function estimateReadingTime(body: ContentBlock[]): number {
  const words = body.reduce((sum, b) => sum + b.c.split(/\s+/).length, 0)
  return Math.max(2, Math.round(words / 200))
}

function build(
  raw: RawArticle[],
  meta: Record<string, { title: string; date: string }>,
  i18n: Record<string, LocalizedMeta>,
  locale: Locale,
): Article[] {
  return raw
    .map((a) => {
      const localized = locale !== "fi" ? i18n[a.slug]?.[locale] : undefined
      return {
        slug: a.slug,
        title: localized?.title ?? meta[a.slug]?.title ?? a.title,
        desc: localized?.desc ?? a.desc,
        img: a.img,
        body: (localized?.body as ContentBlock[]) ?? (a.body as ContentBlock[]),
        date: meta[a.slug]?.date ?? "2025-01-01",
        readingTime: estimateReadingTime(a.body as ContentBlock[]),
      }
    })
    .sort((x, y) => (x.date < y.date ? 1 : -1))
}

export function getBlogArticles(locale: Locale = "fi"): Article[] {
  return build(blogData.blog as RawArticle[], blogMeta, blogMetaI18n, locale)
}

export function getSponsorStories(locale: Locale = "fi"): Article[] {
  return build(blogData.sponsor as RawArticle[], sponsorMeta, sponsorMetaI18n, locale)
}

export function getBlogArticle(slug: string, locale: Locale = "fi"): Article | undefined {
  return getBlogArticles(locale).find((a) => a.slug === slug)
}

export function getSponsorStory(slug: string, locale: Locale = "fi"): Article | undefined {
  return getSponsorStories(locale).find((a) => a.slug === slug)
}

// Taaksepäin yhteensopivat fi-listat (käytetään esim. staattisten polkujen luontiin)
export const blogArticles: Article[] = getBlogArticles("fi")
export const sponsorStories: Article[] = getSponsorStories("fi")

const monthsByLocale: Record<Locale, string[]> = {
  fi: [
    "tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta",
    "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta",
  ],
  sv: [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
}

export function formatDate(iso: string, locale: string = "fi"): string {
  const d = new Date(iso)
  const months = monthsByLocale[locale as Locale] ?? monthsByLocale.fi
  if (locale === "en") return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  if (locale === "sv") return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`
}
