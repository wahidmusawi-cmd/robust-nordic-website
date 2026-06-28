import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import type { Locale } from "@/i18n/routing"

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const messages: Record<string, { title: string; body: string; cta: string }> = {
    fi: {
      title: "Kiitos tilauksestasi!",
      body: "Tilauksesi on vastaanotettu ja se käsitellään pian. Lähetämme sinulle vahvistuksen sähköpostitse.",
      cta: "Jatka ostoksia",
    },
    sv: {
      title: "Tack för din beställning!",
      body: "Din beställning har mottagits och behandlas snart. Vi skickar en bekräftelse via e-post.",
      cta: "Fortsätt handla",
    },
    en: {
      title: "Thank you for your order!",
      body: "Your order has been received and will be processed shortly. We'll send you a confirmation by email.",
      cta: "Continue shopping",
    },
  }

  const t = messages[locale] ?? messages.fi

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.body}</p>
        <Button asChild size="lg">
          <Link href="/tuotteet">{t.cta}</Link>
        </Button>
      </div>
    </main>
  )
}
