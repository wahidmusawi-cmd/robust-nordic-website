import Link from "next/link"
import { Search, Users } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatEur, formatNumber, formatPercent } from "@/lib/admin/format"
import { COUNTRY_LABELS, computeCustomers } from "@/lib/admin/metrics"
import { getOrders } from "@/lib/admin/orders"

export const metadata = { title: "Asiakkaat" }

const PAGE_SIZE = 25

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AsiakkaatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = first(params.q)?.trim() ?? ""

  // Fixed 180-day horizon: getOrders(90) fetches a 2× window.
  const result = await getOrders(90)
  const customers = computeCustomers(result)

  const returning = customers.filter((c) => c.orderCount > 1).length
  const returningShare = customers.length > 0 ? returning / customers.length : 0
  const avgSpent =
    customers.length > 0
      ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length)
      : 0

  const query = q.toLowerCase()
  const filtered = query
    ? customers.filter(
        (c) =>
          c.email.toLowerCase().includes(query) ||
          (c.name ?? "").toLowerCase().includes(query),
      )
    : customers

  const requestedPage = Number(first(params.sivu))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(
    Number.isFinite(requestedPage) && requestedPage >= 1 ? Math.floor(requestedPage) : 1,
    totalPages,
  )
  const start = (page - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  const pageHref = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set("q", q)
    if (p > 1) sp.set("sivu", String(p))
    const s = sp.toString()
    return s ? `/admin/asiakkaat?${s}` : "/admin/asiakkaat"
  }

  return (
    <>
      <PageHeader
        title="Asiakkaat"
        description={`${formatNumber(customers.length)} asiakasta viimeisen 180 päivän tilauksista`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Asiakkaita" value={formatNumber(customers.length)} />
        <StatCard
          label="Palaavia asiakkaita"
          value={`${formatNumber(returning)} (${formatPercent(returningShare)})`}
        />
        <StatCard label="Keskimääräinen asiakasarvo" value={formatEur(avgSpent)} />
      </div>

      <Card>
        <CardContent className="space-y-4">
          <form action="/admin/asiakkaat" method="get" className="flex max-w-md items-center gap-2">
            <div className="relative w-full">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Hae nimellä tai sähköpostilla…"
                aria-label="Hae asiakkaita"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Hae
            </Button>
          </form>

          {pageRows.length === 0 ? (
            <EmptyState
              icon={Users}
              title={q ? "Ei osumia haulle" : "Ei vielä asiakkaita"}
              description={
                q
                  ? "Kokeile toista nimeä tai sähköpostiosoitetta."
                  : "Asiakkaat näkyvät täällä, kun ensimmäinen maksettu tilaus saapuu."
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asiakas</TableHead>
                    <TableHead>Maa</TableHead>
                    <TableHead className="text-right">Tilauksia</TableHead>
                    <TableHead className="text-right">Ostot yhteensä</TableHead>
                    <TableHead>Viimeisin tilaus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((customer) => (
                    <TableRow key={customer.email} className="relative">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/tilaukset?jakso=90&q=${encodeURIComponent(customer.email)}`}
                            className="font-medium hover:underline after:absolute after:inset-0 after:content-['']"
                          >
                            {customer.name ?? "—"}
                          </Link>
                          {customer.orderCount > 1 && (
                            <Badge variant="secondary">Palaava</Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground block text-xs">
                          {customer.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {customer.country
                          ? (COUNTRY_LABELS[customer.country] ?? customer.country)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(customer.orderCount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatEur(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(customer.lastOrderAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-sm">
                  Näytetään {formatNumber(start + 1)}–
                  {formatNumber(Math.min(start + PAGE_SIZE, filtered.length))} /{" "}
                  {formatNumber(filtered.length)}
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={pageHref(page - 1)}>Edellinen</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Edellinen
                    </Button>
                  )}
                  {page < totalPages ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={pageHref(page + 1)}>Seuraava</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Seuraava
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
