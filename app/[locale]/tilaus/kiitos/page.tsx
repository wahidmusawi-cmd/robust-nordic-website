import { getStripe } from "@/lib/admin/stripe"
import { setRequestLocale } from "next-intl/server"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success"
import type { Locale } from "@/i18n/routing"

interface Props {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ session_id?: string }>
}

type LineItem = {
  description: string | null
  quantity: number | null
  amount_total: number
  currency: string
}

export default async function KiitosPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { session_id } = await searchParams
  setRequestLocale(locale)

  const productSegment =
    locale === "en" ? "products" : locale === "sv" ? "produkter" : "tuotteet"

  let customerEmail: string | null = null
  let lineItems: LineItem[] = []
  let total: number | null = null
  let currency = "eur"
  let error = false

  if (session_id) {
    try {
      const stripe = getStripe()
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items"],
        })
        customerEmail = session.customer_details?.email ?? null
        total = session.amount_total
        currency = session.currency ?? "eur"
        lineItems = (session.line_items?.data ?? []).map((li) => ({
          description: li.description,
          quantity: li.quantity,
          amount_total: li.amount_total,
          currency: li.currency,
        }))
      }
    } catch {
      error = true
    }
  }

  function fmtPrice(amount: number, cur: string) {
    return new Intl.NumberFormat(locale, { style: "currency", currency: cur.toUpperCase() }).format(
      amount / 100,
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <ClearCartOnSuccess />
      <div className="w-full max-w-md">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
        </div>

        <h1 className="font-serif text-3xl text-foreground text-center mb-2">
          {locale === "en" ? "Thank you!" : locale === "sv" ? "Tack!" : "Kiitos tilauksestasi!"}
        </h1>

        {customerEmail && (
          <p className="text-center text-muted-foreground text-sm mb-8">
            {locale === "en"
              ? `Confirmation sent to ${customerEmail}`
              : locale === "sv"
                ? `Bekräftelse skickas till ${customerEmail}`
                : `Tilausvahvistus lähetetään osoitteeseen ${customerEmail}`}
          </p>
        )}

        {/* Order summary */}
        {lineItems.length > 0 && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                {locale === "en" ? "Your order" : locale === "sv" ? "Din beställning" : "Tilauksesi"}
              </span>
            </div>
            <div className="divide-y divide-border">
              {lineItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3">
                  <div>
                    <p className="text-sm text-foreground">{item.description}</p>
                    {item.quantity && item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {fmtPrice(item.amount_total, item.currency)}
                  </p>
                </div>
              ))}
            </div>
            {total !== null && (
              <div className="flex justify-between items-center px-5 py-4 border-t border-border bg-secondary/10">
                <span className="font-semibold text-foreground">
                  {locale === "en" ? "Total" : locale === "sv" ? "Totalt" : "Yhteensä"}
                </span>
                <span className="font-semibold text-foreground">{fmtPrice(total, currency)}</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            {locale === "en"
              ? "We couldn't load your order details, but your order has been placed."
              : locale === "sv"
                ? "Vi kunde inte ladda din orderinformation, men din beställning är bekräftad."
                : "Tilauksen tietoja ei voitu ladata, mutta tilauksesi on vastaanotettu."}
          </p>
        )}

        <Link
          href={`/${productSegment}`}
          className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-accent transition-colors"
        >
          {locale === "en" ? "Continue shopping" : locale === "sv" ? "Fortsätt handla" : "Jatka ostoksia"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  )
}
