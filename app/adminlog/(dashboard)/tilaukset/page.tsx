import Link from "next/link"
import { Download, Search, ShoppingBag } from "lucide-react"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, formatMoney, formatNumber } from "@/lib/admin/format"
import { getOrders } from "@/lib/admin/orders"
import {
  RANGE_LABELS,
  parseRange,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin/types"
import { cn } from "@/lib/utils"

export const metadata = { title: "Tilaukset" }

const PAGE_SIZE = 25

type StatusFilter = {
  /** URL value for ?tila=, null = no filter. */
  value: string | null
  label: string
  statuses: OrderStatus[] | null
}

const ALL_FILTER: StatusFilter = { value: "kaikki", label: "Kaikki", statuses: null }

const STATUS_FILTERS: StatusFilter[] = [
  ALL_FILTER,
  { value: "maksettu", label: "Maksettu", statuses: ["paid"] },
  { value: "avoin", label: "Kesken", statuses: ["open"] },
  { value: "hylatty", label: "Hylätty", statuses: ["expired"] },
  { value: "hyvitetty", label: "Hyvitetty", statuses: ["refunded", "partially_refunded"] },
]

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function listHref(query: { jakso?: string; tila?: string; q?: string; sivu?: string }): string {
  const sp = new URLSearchParams()
  if (query.jakso) sp.set("jakso", query.jakso)
  if (query.tila && query.tila !== "maksettu") sp.set("tila", query.tila)
  if (query.q) sp.set("q", query.q)
  if (query.sivu) sp.set("sivu", query.sivu)
  const s = sp.toString()
  return s ? `/adminlog/tilaukset?${s}` : "/adminlog/tilaukset"
}

function countByStatuses(orders: AdminOrder[], statuses: OrderStatus[] | null): number {
  if (!statuses) return orders.length
  return orders.reduce((sum, o) => sum + (statuses.includes(o.status) ? 1 : 0), 0)
}

export default async function TilauksetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const days = parseRange(params.jakso)
  const q = first(params.q)?.trim() ?? ""
  const tila = first(params.tila) ?? "maksettu"  // default: show only paid orders
  // Canonical ?jakso= value to carry through links (30 is the default → omitted).
  const jakso = days === 30 ? undefined : String(days)

  const result = await getOrders(days)
  // getOrders returns a 2× window; the list shows only the current period.
  const windowStart = result.fetchedAt - days * 86_400_000
  const windowOrders = result.orders.filter((o) => o.created >= windowStart)

  const needle = q.toLowerCase()
  const searched = needle
    ? windowOrders.filter(
        (o) =>
          o.number.toLowerCase().includes(needle) ||
          (o.customerName ?? "").toLowerCase().includes(needle) ||
          (o.customerEmail ?? "").toLowerCase().includes(needle),
      )
    : windowOrders

  const activeFilter = (tila === "kaikki" ? ALL_FILTER : STATUS_FILTERS.find((f) => f.value === tila)) ?? ALL_FILTER
  const activeStatuses = activeFilter.statuses
  const filtered = activeStatuses
    ? searched.filter((o) => activeStatuses.includes(o.status))
    : searched

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const requestedPage = Number(first(params.sivu))
  const page = Math.min(
    Number.isFinite(requestedPage) && requestedPage >= 1 ? Math.floor(requestedPage) : 1,
    totalPages,
  )
  const start = (page - 1) * PAGE_SIZE
  const pageOrders = filtered.slice(start, start + PAGE_SIZE)
  const hasFilters = q !== "" || activeFilter.value !== null

  const prevHref = listHref({
    jakso,
    tila: activeFilter.value ?? undefined,
    q: q || undefined,
    sivu: page - 1 > 1 ? String(page - 1) : undefined,
  })
  const nextHref = listHref({
    jakso,
    tila: activeFilter.value ?? undefined,
    q: q || undefined,
    sivu: String(Math.min(page + 1, totalPages)),
  })

  return (
    <>
      <PageHeader
        title="Tilaukset"
        description={`${formatNumber(windowOrders.length)} tilausta · ${RANGE_LABELS[days]}`}
        actions={
          <>
            <DateRangeTabs />
            <Button variant="outline" asChild>
              <a href="/adminlog/tilaukset/vie">
                <Download aria-hidden />
                Vie CSV
              </a>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Suodata tilan mukaan" className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((filter) => (
            <Link
              key={filter.label}
              href={listHref({
                jakso,
                tila: filter.value ?? undefined,
                q: q || undefined,
              })}
              aria-current={filter === activeFilter ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                filter === activeFilter
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
              <span className="text-xs tabular-nums opacity-70">
                {formatNumber(countByStatuses(searched, filter.statuses))}
              </span>
            </Link>
          ))}
        </nav>

        <form action="/adminlog/tilaukset" method="get" className="relative w-full sm:w-80">
          {jakso && <input type="hidden" name="jakso" value={jakso} />}
          {activeFilter.value && <input type="hidden" name="tila" value={activeFilter.value} />}
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Hae tilausnumerolla, nimellä tai sähköpostilla…"
            aria-label="Hae tilauksia"
            className="pl-9"
          />
        </form>
      </div>

      {pageOrders.length === 0 ? (
        <Card className="py-0">
          <EmptyState
            icon={ShoppingBag}
            title="Ei tilauksia"
            description={
              hasFilters
                ? "Yksikään tilaus ei vastaa hakua tai valittua tilaa. Kokeile muuttaa suodattimia."
                : "Valitulla ajanjaksolla ei ole vielä tilauksia."
            }
          />
        </Card>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Tilaus</TableHead>
                <TableHead>Päivämäärä</TableHead>
                <TableHead>Asiakas</TableHead>
                <TableHead>Tila</TableHead>
                <TableHead>Tuotteet</TableHead>
                <TableHead className="pr-5 text-right">Summa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageOrders.map((order) => (
                <TableRow key={order.id} className="relative">
                  <TableCell className="pl-5">
                    <Link
                      href={`/adminlog/tilaukset/${order.id}`}
                      className="font-medium hover:underline after:absolute after:inset-0 after:content-['']"
                    >
                      {order.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(order.created)}
                  </TableCell>
                  <TableCell>
                    <div>{order.customerName ?? "—"}</div>
                    {order.customerEmail && (
                      <div className="text-muted-foreground text-xs">{order.customerEmail}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatNumber(order.itemCount)} kpl
                  </TableCell>
                  <TableCell className="pr-5 text-right tabular-nums">
                    <div>{formatMoney(order.amountTotal, order.currency)}</div>
                    {order.presentment && (
                      <div className="text-muted-foreground text-xs">
                        maksettu {formatMoney(order.presentment.amountTotal, order.presentment.currency)}
                      </div>
                    )}
                    {order.amountRefunded > 0 && (
                      <div className="text-xs text-rose-700">
                        -{formatMoney(order.amountRefunded, order.currency)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className="text-muted-foreground text-sm">
              Näytetään {formatNumber(start + 1)}–
              {formatNumber(Math.min(start + PAGE_SIZE, filtered.length))} /{" "}
              {formatNumber(filtered.length)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
              >
                <Link
                  href={prevHref}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                >
                  Edellinen
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(page >= totalPages && "pointer-events-none opacity-50")}
              >
                <Link
                  href={nextHref}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : undefined}
                >
                  Seuraava
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
