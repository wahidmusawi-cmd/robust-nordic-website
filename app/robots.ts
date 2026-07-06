import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/adminlog/", "/api/", "/tilaus/kiitos"],
      },
    ],
    sitemap: [
      "https://robustnordic.fi/sitemap.xml",
      "https://robustnordic.se/sitemap.xml",
      "https://robustnordic.com/sitemap.xml",
    ],
  }
}
