import policiesData from "./policies-data.json"
import type { ContentBlock } from "./blog"

export { type ContentBlock }

type PolicyKey = "shipping" | "payments" | "privacy" | "terms"
type Locale = "fi" | "sv" | "en"

export function getPolicyContent(key: PolicyKey, locale: Locale = "fi"): ContentBlock[] {
  const data = policiesData[key]
  if (!data) return []
  const localized = locale !== "fi" ? data[locale] : undefined
  return (localized ?? data.fi) as ContentBlock[]
}
