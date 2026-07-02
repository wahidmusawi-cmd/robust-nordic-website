import Link from "next/link"
import { Layers, Package, ReceiptText, TrendingUp, Users } from "lucide-react"
import { BarList } from "@/components/admin/bar-list"
import { ChartTable } from "@/components/admin/chart-table"
import { TimeSeriesChart } from "@/components/admin/charts"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { SplitBar } from "@/components/admin/split-bar"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatEur, formatNumber, formatPercent } from "@/lib/admin/format"
import { computeOverview } from "@/lib/admin/metrics"
import { getOrders } from "@/lib/admin/orders"
import { parseRange, RANGE_LABELS } from "@/lib/admin/types"

export const metadata = { title: "Yleiskatsaus" }

const DAY_MS = 86_400_000

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const days = parseRange(params.jakso)
  const result = await getOrders(days)
  const overview = computeOverview(result, days)

  // Newest orders in the current window, any status.
  const windowStart = result.fetchedAt - days * DAY_MS
  const recentOrders = result.orders
    .filter((o) => o.created >= windowStart)
    .sort((a, b) => b.created - a.created)
    .slice(0, 6)

  const topProducts = overview.topProducts.slice(0, 5)
  const categoryTotal = overview.categoryMix.reduce((s, c) => s + c.sales, 0)
  const customerTotal = overview.newCustomers + overview.returningCustomers

  return (
    <>
      <PageHeader
        title="Yleiskatsaus"
        description={RANGE_LABELS[days]}
        actions={<DateRangeTabs />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Myynti"
          value={formatEur(overview.netSales)}
          current={overview.netSales}
          previous={overview.netSalesPrev}
          spark={overview.sparkSales}
        />
        <StatCard
          label="Tilaukset"
          value={formatNumber(overview.orderCount)}
          current={overview.orderCount}
          previous={overview.orderCountPrev}
          spark={overview.sparkOrders}
        />
        <StatCard
          label="Keskiostos"
          value={formatEur(overview.aov)}
          current={overview.aov}
          previous={overview.aovPrev}
          spark={overview.sparkAov}
        />
        <StatCard
          label="Hylätyt kassat"
          value={formatNumber(overview.abandonedCount)}
          current={overview.abandonedCount}
          previous={overview.abandonedCountPrev}
          positiveIsGood={false}
          spark={overview.sparkAbandoned}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Myynti ajan mittaan</CardTitle>
        </CardHeader>
        <CardContent>
          {overview.orderCount === 0 ? (
            <EmptyState icon={TrendingUp} title="Ei vielä myyntiä valitulla jaksolla" />
          ) : (
            <>
              <TimeSeriesChart
                data={overview.dailySeries.map((p) => ({ label: p.label, value: p.sales }))}
                kind="area"
                valueKind="eur"
                name="Myynti"
              />
              <ChartTable
                columns={["Päivä", "Myynti", "Tilaukset"]}
                rows={overview.dailySeries.map((p) => [
                  p.label,
                  formatEur(p.sales),
                  formatNumber(p.orders),
                ])}
              />
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Suosituimmat tuotteet</CardTitle>
            <CardAction>
              <Link href="/admin/tuotteet" className="text-primary text-sm hover:underline">
                Näytä kaikki
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <EmptyState icon={Package} title="Ei myytyjä tuotteita valitulla jaksolla" />
            ) : (
              <BarList
                rows={topProducts.map((p) => ({
                  key: p.slug ?? p.name,
                  label: p.name,
                  value: p.sales,
                  display: formatEur(p.sales),
                  hint: `${formatNumber(p.units)} kpl`,
                  image: p.image,
                  href: p.slug ? `/admin/tuotteet/${p.slug}` : undefined,
                }))}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Viimeisimmät tilaukset</CardTitle>
            <CardAction>
              <Link href="/admin/tilaukset" className="text-primary text-sm hover:underline">
                Näytä kaikki
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <EmptyState icon={ReceiptText} title="Ei tilauksia valitulla jaksolla" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tilaus</TableHead>
                    <TableHead>Asiakas</TableHead>
                    <TableHead>Tila</TableHead>
                    <TableHead className="text-right">Summa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="relative">
                      <TableCell>
                        <Link
                          href={`/admin/tilaukset/${order.id}`}
                          className="font-medium hover:underline after:absolute after:inset-0 after:content-['']"
                        >
                          {order.number}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-36 truncate">
                        {order.customerName ?? order.customerEmail ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatEur(order.amountTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Myynti kategorioittain</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryTotal === 0 ? (
              <EmptyState icon={Layers} title="Ei myyntiä valitulla jaksolla" />
            ) : (
              <div className="space-y-4">
                <SplitBar
                  segments={overview.categoryMix.map((c) => ({
                    key: c.key,
                    label: c.label,
                    value: c.sales,
                    display: formatPercent(c.share),
                  }))}
                />
                <p className="text-muted-foreground text-sm">
                  Yhteensä {formatEur(categoryTotal)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Asiakkaat</CardTitle>
          </CardHeader>
          <CardContent>
            {customerTotal === 0 ? (
              <EmptyState icon={Users} title="Ei asiakkaita valitulla jaksolla" />
            ) : (
              <div className="space-y-4">
                <SplitBar
                  segments={[
                    {
                      key: "uudet",
                      label: "Uudet",
                      value: overview.newCustomers,
                      display: formatNumber(overview.newCustomers),
                    },
                    {
                      key: "palaavat",
                      label: "Palaavat",
                      value: overview.returningCustomers,
                      display: formatNumber(overview.returningCustomers),
                    },
                  ]}
                />
                {overview.checkoutConversion !== null && (
                  <div className="flex items-baseline justify-between border-t pt-4">
                    <div>
                      <p className="text-sm font-medium">Kassakonversio</p>
                      <p className="text-muted-foreground text-xs">
                        maksetut ÷ päättyneet kassat
                      </p>
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatPercent(overview.checkoutConversion)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
