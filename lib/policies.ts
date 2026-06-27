import policiesData from "./policies-data.json"
import type { ContentBlock } from "./blog"

export { type ContentBlock }

type PolicyKey = "shipping" | "payments" | "privacy" | "terms"

export function getPolicyContent(key: PolicyKey, locale: string = "fi"): ContentBlock[] {
  const data = (policiesData as Record<string, Record<string, ContentBlock[]>>)[key]
  if (!data) return []
  const localized = locale !== "fi" ? data[locale] : undefined
  return (localized ?? data["fi"]) as ContentBlock[]
}
