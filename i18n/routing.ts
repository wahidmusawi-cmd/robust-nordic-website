import { defineRouting } from "next-intl/routing"

export const locales = ["fi", "sv", "en"] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: "fi",
  // All locales use explicit prefix: /fi/, /sv/, /en/
  localePrefix: "always",
})
