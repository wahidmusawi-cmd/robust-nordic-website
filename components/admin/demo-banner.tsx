import { FlaskConical } from "lucide-react"

export function DemoBanner() {
  return (
    <div className="border-amber-200 bg-amber-50 text-amber-900 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm">
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <span className="font-semibold">Demo-tila:</span> Stripe-avainta ei ole määritetty, joten
        näet generoitua esimerkkidataa. Lisää <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">STRIPE_SECRET_KEY</code>{" "}
        ympäristömuuttujiin nähdäksesi oikeat tilaukset.
      </p>
    </div>
  )
}
