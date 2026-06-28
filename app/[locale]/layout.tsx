import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { IntlProvider } from "@/components/intl-provider"
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { routing } from "@/i18n/routing"
import { activeFonts } from "@/lib/fonts"
import "../globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  return {
    title: t("title"),
    description: t("description"),
    generator: "v0.app",
    icons: {
      icon: [
        { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${activeFonts.serif.variable} ${activeFonts.sans.variable} bg-background`}>
      <body className="font-sans antialiased">
        <IntlProvider messages={messages} locale={locale}>
          <SiteHeader />
          {children}
          <Footer />
        </IntlProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
