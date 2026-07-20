export const dynamic = 'force-dynamic'

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, Receipt } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDateTime, formatMoney, formatNumber } from "@/lib/admin/format"
import { COUNTRY_LABELS, isPaidLike } from "@/lib/admin/metrics"
import { getOrder } from "@/lib/admin/orders"
import { stripePaymentUrl } from "@/lib/admin/stripe"

export const metadata = { title: "Tilaus" }

type TimelineEvent = {
  key: string
  label: string
  at: number | null
  dotClass: string
}

function PaymentRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between text-sm ${className ?? ""}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  const isDemo = order.id.startsWith("cs_demo_")
  const netPaid = order.amountTotal - order.amountRefunded

  const events: TimelineEvent[] = [
    { key: "created", label: "Tilaus luotu", at: order.created, dotClass: "bg-slate-300" },
  ]
  if (isPaidLike(order)) {
    events.push({
      key: "paid",
      label: "Maksu vahvistettu",
      at: order.created,
      dotClass: "bg-emerald-500",
    })
  }
  for (const [i, refund] of [...order.refunds]
    .sort((a, b) => a.created - b.created)
    .entries()) {
    events.push({
      key: `refund-${i}`,
      label: `Hyvitys ${formatMoney(refund.amount, order.currency)}`,
      at: refund.created,
      dotClass: "bg-rose-500",
    })
  }
  if (order.status === "open") {
    events.push({ key: "open", label: "Kassa kesken", at: null, dotClass: "bg-slate-400" })
  }
  if (order.status === "expired") {
    events.push({ key: "expired", label: "Kassa vanhentui", at: null, dotClass: "bg-slate-400" })
  }

  return (
    <>
      <PageHeader
        backHref="/adminlog/tilaukset"
        backLabel="Tilaukset"
        title={order.number}
        meta={<StatusBadge status={order.status} />}
        description={formatDateTime(order.created)}
        actions={
          !isDemo ? (
            <>
              {order.receiptUrl && (
                <Button variant="outline" asChild>
                  <a href={order.receiptUrl} target="_blank" rel="noreferrer">
                    <Receipt aria-hidden />
                    Kuitti
                  </a>
                </Button>
              )}
              {order.paymentIntentId && (
                <Button variant="outline" asChild>
                  <a
                    href={stripePaymentUrl(order.paymentIntentId)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink aria-hidden />
                    Avaa Stripessä
                  </a>
                </Button>
              )}
            </>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Tuotteet ({formatNumber(order.itemCount)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.priceId ?? item.description}-${index}`}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        className="bg-secondary size-12 shrink-0 rounded-md object-contain"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      {item.slug ? (
                        <Link
                          href={`/adminlog/tuotteet/${item.slug}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.description}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium">{item.description}</p>
                      )}
                      {item.unitAmount !== null && (
                        <p className="text-muted-foreground text-sm">
                          {formatNumber(item.quantity)} × {formatMoney(item.unitAmount, order.currency)}
                        </p>
                      )}
                    </div>
                    <p className="text-right text-sm tabular-nums">
                      {formatMoney(item.amountTotal, order.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Maksu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PaymentRow label="Välisumma" value={formatMoney(order.amountSubtotal, order.currency)} />
              {order.amountDiscount > 0 && (
                <PaymentRow label="Alennus" value={`−${formatMoney(order.amountDiscount, order.currency)}`} />
              )}
              <PaymentRow
                label="Toimitus"
                value={order.amountShipping === 0 ? "Ilmainen" : formatMoney(order.amountShipping, order.currency)}
              />
              {order.amountTax > 0 && <PaymentRow label="ALV" value={formatMoney(order.amountTax, order.currency)} />}
              <Separator />
              <PaymentRow
                label="Yhteensä"
                value={formatMoney(order.amountTotal, order.currency)}
                className="font-semibold"
              />
              {order.presentment && (
                <PaymentRow
                  label={`Veloitettu asiakkaalta (${order.presentment.currency.toUpperCase()})`}
                  value={formatMoney(order.presentment.amountTotal, order.presentment.currency)}
                  className="text-muted-foreground"
                />
              )}
              {order.amountRefunded > 0 && (
                <>
                  <PaymentRow
                    label="Hyvitetty"
                    value={`−${formatMoney(order.amountRefunded, order.currency)}`}
                    className="text-rose-700"
                  />
                  <PaymentRow
                    label="Asiakas maksoi"
                    value={formatMoney(netPaid, order.currency)}
                    className="font-semibold"
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tapahtumat</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-l pl-4">
                {events.map((event) => (
                  <li key={event.key}>
                    <span
                      className={`absolute -left-[5px] mt-1 size-2.5 rounded-full ${event.dotClass}`}
                      aria-hidden
                    />
                    <p className="text-sm font-medium">{event.label}</p>
                    {event.at !== null && (
                      <p className="text-muted-foreground text-sm">{formatDateTime(event.at)}</p>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Asiakas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {order.customerName ? (
                <p className="font-medium">{order.customerName}</p>
              ) : (
                <p className="text-muted-foreground">Ei nimeä</p>
              )}
              {order.customerEmail && (
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-primary block break-all hover:underline"
                >
                  {order.customerEmail}
                </a>
              )}
            </CardContent>
            {order.customerEmail && (
              <CardFooter className="border-t">
                <Link
                  href={`/adminlog/tilaukset?jakso=90&q=${encodeURIComponent(order.customerEmail)}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Näytä asiakkaan tilaukset
                </Link>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Toimitusosoite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5 text-sm">
              {order.shippingAddress || order.shippingName ? (
                <>
                  {order.shippingName && <p className="font-medium">{order.shippingName}</p>}
                  {order.shippingAddress?.line1 && <p>{order.shippingAddress.line1}</p>}
                  {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                  {(order.shippingAddress?.postalCode || order.shippingAddress?.city) && (
                    <p>
                      {[order.shippingAddress.postalCode, order.shippingAddress.city]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  )}
                  {order.shippingAddress?.country && (
                    <p>
                      {COUNTRY_LABELS[order.shippingAddress.country] ??
                        order.shippingAddress.country}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Ei toimitusosoitetta</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Lisätiedot</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Tunniste</dt>
                  <dd className="font-mono text-xs break-all">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Maksutunniste</dt>
                  <dd className="font-mono text-xs break-all">{order.paymentIntentId ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Kieli</dt>
                  <dd>{order.locale ? order.locale.toUpperCase() : "—"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Valuutta</dt>
                  <dd>{order.currency.toUpperCase()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
