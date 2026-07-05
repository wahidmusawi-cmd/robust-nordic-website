import { defineRouting } from "next-intl/routing"

export const locales = ["fi", "sv", "en"] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: "fi",
  // Each storefront domain serves its own language at the root
  // (robustnordic.fi → fi, .se → sv, .com → en); the other locales are
  // path-prefixed (e.g. robustnordic.se/fi). Unmatched hosts (vercel.app,
  // localhost) fall back to Finnish at the root.
  localePrefix: "as-needed",
  domains: [
    { domain: "robustnordic.fi", defaultLocale: "fi", locales: ["fi", "sv", "en"] },
    { domain: "robustnordic.se", defaultLocale: "sv", locales: ["fi", "sv", "en"] },
    { domain: "robustnordic.com", defaultLocale: "en", locales: ["fi", "sv", "en"] },
  ],
})
