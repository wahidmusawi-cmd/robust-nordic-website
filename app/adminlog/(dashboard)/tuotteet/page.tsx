import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, TriangleAlert } from "lucide-react"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatEur, formatNumber } from "@/lib/admin/format"
import { CATEGORY_LABELS, computeOverview, type ProductPerf } from "@/lib/admin/metrics"
import { getOrders } from "@/lib/admin/orders"
import { parseRange } from "@/lib/admin/types"
import { products } from "@/lib/products"

export const metadata = { title: "Tuotteet" }

export default async function TuotteetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const days = parseRange(params.jakso)
  const result = await getOrders(days)
  const overview = computeOverview(result, days)

  // Period performance keyed by catalog slug (topProducts may include unmapped lines).
  const perfBySlug = new Map<string, ProductPerf>()
  for (const perf of overview.topProducts) {
    if (perf.slug) perfBySlug.set(perf.slug, perf)
  }

  const rows = products
    .map((product) => {
      const perf = perfBySlug.get(product.slug)
      return { product, units: perf?.units ?? 0, sales: perf?.sales ?? 0 }
    })
    .sort(
      (a, b) =>
        b.sales - a.sales || a.product.shortName.localeCompare(b.product.shortName, "fi"),
    )

  const totalUnits = rows.reduce((sum, row) => sum + row.units, 0)
  const totalSales = rows.reduce((sum, row) => sum + row.sales, 0)

  return (
    <>
      <PageHeader
        title="Tuotteet"
        description={`${products.length} tuotetta katalogissa`}
        actions={<DateRangeTabs />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Tuotteita" value={formatNumber(products.length)} />
        <StatCard label={`Myyty ${days} pv`} value={formatNumber(totalUnits)} />
        <StatCard label={`Tuotemyynti ${days} pv`} value={formatEur(totalSales)} />
      </div>

      <Card>
        <CardContent>
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Tuote</TableHead>
                <TableHead>Kategoria</TableHead>
                <TableHead className="text-right">Hinta</TableHead>
                <TableHead>Stripe</TableHead>
                <TableHead className="text-right">Myyty</TableHead>
                <TableHead className="text-right">Myynti</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ product, units, sales }) => (
                <TableRow key={product.slug} className="relative">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt=""
                        width={40}
                        height={40}
                        className="bg-secondary size-10 shrink-0 rounded-md object-contain p-1"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/adminlog/tuotteet/${product.slug}`}
                          className="font-medium hover:underline after:absolute after:inset-0 after:content-['']"
                        >
                          {product.shortName}
                        </Link>
                        {product.size && (
                          <p className="text-muted-foreground text-xs">{product.size}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{CATEGORY_LABELS[product.category]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.price} €
                  </TableCell>
                  <TableCell>
                    {product.stripePriceId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                        <CheckCircle2 className="size-3.5" aria-hidden />
                        Kytketty
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                        <TriangleAlert className="size-3.5" aria-hidden />
                        Puuttuu
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(units)} kpl
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatEur(sales)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
