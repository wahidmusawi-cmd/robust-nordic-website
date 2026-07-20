export const dynamic = 'force-dynamic'

import { CheckCircle2, Clock, KeyRound, PauseCircle, RefreshCw, XCircle, type LucideIcon } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatEur, formatNumber } from "@/lib/admin/format"
import { getSubscriptions } from "@/lib/admin/subscriptions"
import { products } from "@/lib/products"
import { cn } from "@/lib/utils"

export const metadata = { title: "Kestotilaukset" }

const STATUS_META: Record<string, { label: string; className: string; Icon: LucideIcon }> = {
  active: { label: "Aktiivinen", className: "bg-emerald-50 text-emerald-800 border-emerald-200", Icon: CheckCircle2 },
  trialing: { label: "Kokeilu", className: "bg-emerald-50 text-emerald-800 border-emerald-200", Icon: CheckCircle2 },
  past_due: { label: "Erääntynyt", className: "bg-amber-50 text-amber-800 border-amber-200", Icon: Clock },
  incomplete: { label: "Kesken", className: "bg-amber-50 text-amber-800 border-amber-200", Icon: Clock },
  unpaid: { label: "Maksamatta", className: "bg-rose-50 text-rose-700 border-rose-200", Icon: XCircle },
  canceled: { label: "Peruutettu", className: "bg-slate-50 text-slate-600 border-slate-200", Icon: XCircle },
  incomplete_expired: { label: "Vanhentunut", className: "bg-slate-50 text-slate-600 border-slate-200", Icon: XCircle },
  paused: { label: "Tauolla", className: "bg-slate-50 text-slate-600 border-slate-200", Icon: PauseCircle },
}

function SubStatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    className: "bg-slate-50 text-slate-600 border-slate-200",
    Icon: Clock,
  }
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        meta.className,
      )}
    >
      <meta.Icon className="size-3" aria-hidden />
      {meta.label}
    </span>
  )
}

const productBySlug = new Map(products.map((p) => [p.slug, p] as const))

export default async function KestotilauksetPage() {
  const { rows: subs, permissionError } = await getSubscriptions()

  if (permissionError) {
    return (
      <>
        <PageHeader title="Kestotilaukset" description="Stripe-tilaukset reaaliajassa" />
        <Card className="py-0">
          <EmptyState
            icon={KeyRound}
            title="Stripe-avaimelta puuttuu oikeuksia"
            description="Käytössä oleva rajattu API-avain ei saa lukea tilauksia. Lisää avaimelle oikeudet Stripe Dashboardissa: Developers → API keys → muokkaa avainta → Subscriptions: Read ja Customers: Read."
          />
        </Card>
      </>
    )
  }

  const active = subs.filter((s) => s.status === "active" || s.status === "trialing")

  // Normalize each period total to a 30-day month so mixed 30/60/90-day
  // intervals aggregate into a comparable MRR.
  const mrr = active.reduce((sum, s) => {
    const days = Number(s.intervalDays) || 30
    return sum + Math.round((s.amount * 30) / days)
  }, 0)

  return (
    <>
      <PageHeader
        title="Kestotilaukset"
        description="Stripe-tilaukset reaaliajassa · uusiutuvat automaattisesti"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Aktiiviset kestotilaukset" value={formatNumber(active.length)} />
        <StatCard label="Kuukausituotto (MRR)" value={formatEur(mrr)} />
        <StatCard label="Kaikki tilaukset" value={formatNumber(subs.length)} />
      </div>

      {subs.length === 0 ? (
        <Card className="py-0">
          <EmptyState
            icon={RefreshCw}
            title="Ei vielä kestotilauksia"
            description="Kestotilaukset ilmestyvät tänne, kun asiakas valitsee tuotesivulla kestotilauksen ja maksaa kassalla."
          />
        </Card>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Asiakas</TableHead>
                <TableHead>Tuotteet</TableHead>
                <TableHead>Tila</TableHead>
                <TableHead>Toimitusväli</TableHead>
                <TableHead>Seuraava veloitus</TableHead>
                <TableHead className="pr-5 text-right">Summa / jakso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="pl-5">
                    <div className="font-medium">{sub.customerName ?? "—"}</div>
                    {sub.customerEmail && (
                      <div className="text-muted-foreground text-xs">{sub.customerEmail}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-56">
                    <span className="block truncate">
                      {sub.slugs.length > 0
                        ? sub.slugs
                            .map((slug) => productBySlug.get(slug)?.shortName ?? slug)
                            .join(", ")
                        : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <SubStatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sub.intervalDays ? `${sub.intervalDays} pv` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sub.status === "active" || sub.status === "trialing"
                      ? `${formatDate(sub.currentPeriodEnd)}${sub.cancelAtPeriodEnd ? " (päättyy)" : ""}`
                      : "—"}
                  </TableCell>
                  <TableCell className="pr-5 text-right tabular-nums">
                    {formatEur(sub.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
