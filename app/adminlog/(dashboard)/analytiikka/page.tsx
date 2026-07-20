export const dynamic = 'force-dynamic'

import { BarChart3 } from "lucide-react"
import { BarList } from "@/components/admin/bar-list"
import { ChartTable } from "@/components/admin/chart-table"
import { TimeSeriesChart } from "@/components/admin/charts"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { SplitBar } from "@/components/admin/split-bar"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatEur, formatNumber, formatPercent } from "@/lib/admin/format"
import { computeOverview } from "@/lib/admin/metrics"
import { getOrders } from "@/lib/admin/orders"
import { parseRange, RANGE_LABELS } from "@/lib/admin/types"

export const metadata = { title: "Analytiikka" }

const DAY_MS = 86_400_000

export default async function AnalytiikkaPage({
  searchParams,
}: {
  searchParams: Promise<{ jakso?: string | string[] }>
}) {
  const params = await searchParams
  const days = parseRange(params.jakso)
  const result = await getOrders(days)
  const o = computeOverview(result, days)

  // Checkout funnel top: every session opened in the current window.
  const windowStart = result.fetchedAt - days * DAY_MS
  const startedCount = result.orders.filter((order) => order.created >= windowStart).length
  const funnelShare = (count: number) => (startedCount > 0 ? count / startedCount : 0)

  const hasData = o.orderCount > 0 || o.abandonedCount > 0

  return (
    <>
      <PageHeader
        title="Analytiikka"
        description={RANGE_LABELS[days]}
        actions={<DateRangeTabs />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Myynti"
          value={formatEur(o.netSales)}
          current={o.netSales}
          previous={o.netSalesPrev}
          spark={o.sparkSales}
        />
        <StatCard
          label="Kassakonversio"
          value={o.checkoutConversion != null ? formatPercent(o.checkoutConversion) : "—"}
        />
        <StatCard label="Hyvitykset" value={formatEur(o.refundedAmount)} />
        <StatCard
          label="Myydyt tuotteet"
          value={formatNumber(o.unitsSold)}
          current={o.unitsSold}
          previous={o.unitsSoldPrev}
        />
      </div>

      {!hasData ? (
        <Card>
          <CardContent>
            <EmptyState icon={BarChart3} title="Ei dataa valitulla jaksolla" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Myynti ajan mittaan</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart
                data={o.dailySeries.map((p) => ({ label: p.label, value: p.sales }))}
                kind="area"
                valueKind="eur"
                name="Myynti"
              />
              <ChartTable
                columns={["Päivä", "Myynti"]}
                rows={o.dailySeries.map((p) => [p.label, formatEur(p.sales)])}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tilaukset päivittäin</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart
                  data={o.dailySeries.map((p) => ({ label: p.label, value: p.orders }))}
                  kind="column"
                  valueKind="count"
                  name="Tilaukset"
                  height={240}
                />
                <ChartTable
                  columns={["Päivä", "Tilaukset"]}
                  rows={o.dailySeries.map((p) => [p.label, formatNumber(p.orders)])}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Keskiostoksen kehitys</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart
                  data={o.dailySeries.map((p) => ({
                    label: p.label,
                    // Days without orders have no average — show a gap, not 0 €.
                    value: p.orders > 0 ? p.aov : null,
                  }))}
                  kind="line"
                  valueKind="eur"
                  name="Keskiostos"
                  height={240}
                />
                <ChartTable
                  columns={["Päivä", "Keskiostos"]}
                  rows={o.dailySeries.map((p) => [p.label, p.orders > 0 ? formatEur(p.aov) : "—"])}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tilaukset viikonpäivittäin</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart
                  data={o.weekdayOrders}
                  kind="column"
                  valueKind="count"
                  name="Tilaukset"
                  height={240}
                />
                <ChartTable
                  columns={["Viikonpäivä", "Tilaukset"]}
                  rows={o.weekdayOrders.map((p) => [p.label, formatNumber(p.value)])}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Myynti maittain</CardTitle>
              </CardHeader>
              <CardContent>
                {o.countryMix.length > 0 ? (
                  <BarList
                    rows={o.countryMix.map((c) => ({
                      key: c.code,
                      label: c.label,
                      value: c.sales,
                      display: formatEur(c.sales),
                      hint: `${formatNumber(c.orders)} tilausta`,
                    }))}
                  />
                ) : (
                  <EmptyState icon={BarChart3} title="Ei dataa valitulla jaksolla" />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Myynti kategorioittain</CardTitle>
              </CardHeader>
              <CardContent>
                {o.categoryMix.length > 0 ? (
                  <SplitBar
                    segments={o.categoryMix.map((c) => ({
                      key: c.key,
                      label: c.label,
                      value: c.sales,
                      display: formatPercent(c.share),
                    }))}
                  />
                ) : (
                  <EmptyState icon={BarChart3} title="Ei dataa valitulla jaksolla" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Uudet ja palaavat asiakkaat</CardTitle>
              </CardHeader>
              <CardContent>
                {o.newCustomers + o.returningCustomers > 0 ? (
                  <SplitBar
                    segments={[
                      {
                        key: "uudet",
                        label: "Uudet",
                        value: o.newCustomers,
                        display: formatNumber(o.newCustomers),
                      },
                      {
                        key: "palaavat",
                        label: "Palaavat",
                        value: o.returningCustomers,
                        display: formatNumber(o.returningCustomers),
                      },
                    ]}
                  />
                ) : (
                  <EmptyState icon={BarChart3} title="Ei dataa valitulla jaksolla" />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Kassasuppilo</CardTitle>
            </CardHeader>
            <CardContent>
              <BarList
                rows={[
                  {
                    key: "aloitettu",
                    label: "Kassa aloitettu",
                    value: startedCount,
                    display: formatNumber(startedCount),
                    hint: formatPercent(funnelShare(startedCount)),
                  },
                  {
                    key: "maksettu",
                    label: "Maksettu",
                    value: o.orderCount,
                    display: formatNumber(o.orderCount),
                    hint: formatPercent(funnelShare(o.orderCount)),
                  },
                  {
                    key: "kesken",
                    label: "Kesken",
                    value: startedCount - o.orderCount - o.abandonedCount,
                    display: formatNumber(startedCount - o.orderCount - o.abandonedCount),
                    hint: formatPercent(funnelShare(startedCount - o.orderCount - o.abandonedCount)),
                  },
                  {
                    key: "hylatty",
                    label: "Hylätty",
                    value: o.abandonedCount,
                    display: formatNumber(o.abandonedCount),
                    hint: formatPercent(funnelShare(o.abandonedCount)),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
