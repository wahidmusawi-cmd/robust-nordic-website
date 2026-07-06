import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
  // Accept locale-aware path aliases so URLs are natural per domain:
  // robustnordic.com/products/[slug] → tuotteet/[slug] (internal)
  // robustnordic.se/produkter/[slug] → tuotteet/[slug] (internal)
  async rewrites() {
    return [
      // English aliases (for robustnordic.com)
      { source: "/:locale/products", destination: "/:locale/tuotteet" },
      { source: "/:locale/products/:slug", destination: "/:locale/tuotteet/:slug" },
      { source: "/:locale/blog", destination: "/:locale/blogi" },
      { source: "/:locale/blog/:slug", destination: "/:locale/blogi/:slug" },
      // Swedish aliases (for robustnordic.se)
      { source: "/:locale/produkter", destination: "/:locale/tuotteet" },
      { source: "/:locale/produkter/:slug", destination: "/:locale/tuotteet/:slug" },
      { source: "/:locale/blogg", destination: "/:locale/blogi" },
      { source: "/:locale/blogg/:slug", destination: "/:locale/blogi/:slug" },
    ]
  },
}

export default withNextIntl(nextConfig)
