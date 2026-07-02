import Image from "next/image"
import { notFound } from "next/navigation"
import { ExternalLink, PackageOpen } from "lucide-react"
import { ChartTable } from "@/components/admin/chart-table"
import { TimeSeriesChart } from "@/components/admin/charts"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { EmptyState } from "@/components/admin/empty-state"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEur, formatNumber } from "@/lib/admin/format"
import { CATEGORY_LABELS, computeProductSeries } from "@/lib/admin/metrics"
import { getOrders } from "@/lib/admin/orders"
import { parseRange, RANGE_LABELS } from "@/lib/admin/types"
import { products } from "@/lib/products"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  return { title: product?.shortName ?? "Tuote" }
}

export default async function TuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const sp = await searchParams
  const days = parseRange(sp.jakso)
  const result = await getOrders(days)
  const { series, units, sales, orders } = computeProductSeries(result, slug, days)

  return (
    <>
      <PageHeader
        backHref="/admin/tuotteet"
        backLabel="Tuotteet"
        title={product.shortName}
        description={product.tagline}
        meta={
          <>
            <Badge variant="secondary">{CATEGORY_LABELS[product.category]}</Badge>
            {product.badge && <Badge variant="outline">{product.badge}</Badge>}
          </>
        }
        actions={
          <>
            <DateRangeTabs />
            <Button variant="outline" asChild>
              <a href={`/fi/tuotteet/${slug}`} target="_blank" rel="noreferrer">
                Näytä kaupassa
                <ExternalLink aria-hidden />
              </a>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Myynti" value={formatEur(sales)} />
        <StatCard label="Myyty" value={`${formatNumber(units)} kpl`} />
        <StatCard label="Tilauksia" value={formatNumber(orders)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Myynti ajan mittaan</CardTitle>
          <CardDescription>{RANGE_LABELS[days]}</CardDescription>
        </CardHeader>
        <CardContent>
          {units > 0 ? (
            <>
              <TimeSeriesChart
                data={series.map((p) => ({ label: p.label, value: p.sales }))}
                kind="area"
                valueKind="eur"
                name="Myynti"
              />
              {/* SeriesPoint.orders holds units per day for a single product. */}
              <ChartTable
                columns={["Päivä", "Myynti", "Kpl"]}
                rows={series.map((p) => [p.label, formatEur(p.sales), formatNumber(p.orders)])}
              />
            </>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="Ei myyntiä valitulla jaksolla"
              description="Tuotteella ei ole maksettuja tilauksia tällä aikavälillä. Kokeile pidempää jaksoa."
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-5">
            <div className="bg-secondary relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Hinta</span>
                <span className="font-medium tabular-nums">{product.price} €</span>
              </div>
              {product.size && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Koko</span>
                  <span>{product.size}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Tuoteväri</span>
                <span className="flex items-center gap-2">
                  <span
                    className="size-4 rounded border"
                    style={{ backgroundColor: product.productColor }}
                    aria-hidden
                  />
                  <span className="font-mono text-xs">{product.productColor}</span>
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Stripe</span>
                {product.stripePriceId ? (
                  <span className="font-mono text-xs break-all text-right">
                    {product.stripePriceId}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">Ei kytketty</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tuotetiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-relaxed">{product.description}</p>
            <div>
              <p className="text-sm font-medium">Hyödyt</p>
              <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
            {product.usage && (
              <div>
                <p className="text-sm font-medium">Annostelu</p>
                <p className="text-muted-foreground mt-1 text-sm">{product.usage}</p>
              </div>
            )}
            {product.ingredients && (
              <div>
                <p className="text-sm font-medium">Ainesosat</p>
                <p className="text-muted-foreground mt-1 text-sm">{product.ingredients}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
