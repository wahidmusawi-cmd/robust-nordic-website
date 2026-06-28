import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = (routing.locales as readonly string[]).includes(requested ?? "")
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    onError(error) {
      // Log missing messages as warnings instead of throwing
      // Prevents build failure from dynamic/missing translation keys
      if (typeof console !== "undefined") {
        console.warn("[i18n] Missing translation:", error.originalMessage ?? "(dynamic key)")
      }
    },
    getMessageFallback({ key, namespace }: { key: string; namespace?: string }) {
      return "" // Return empty string for missing keys
    }
  }
})
