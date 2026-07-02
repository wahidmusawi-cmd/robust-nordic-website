import type { Metadata } from "next"
import { activeFonts } from "@/lib/fonts"
import "../globals.css"

export const metadata: Metadata = {
  title: {
    default: "Hallinta – Robust Nordic",
    template: "%s – Robust Nordic Admin",
  },
  robots: { index: false, follow: false },
}

// The admin lives outside the [locale] tree: Finnish-only UI, no next-intl.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fi"
      className={`${activeFonts.serif.variable} ${activeFonts.sans.variable} bg-background`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
