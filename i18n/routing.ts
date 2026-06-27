import { defineRouting } from "next-intl/routing"

export const locales = ["fi", "sv", "en"] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: "fi",
  // Finnish stays at the root (/tuotteet), Swedish/English get a prefix (/sv, /en)
  localePrefix: "as-needed",
})
