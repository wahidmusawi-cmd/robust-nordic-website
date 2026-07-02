import { statusLabel } from "@/components/admin/status-badge"
import { formatDateTime } from "@/lib/admin/format"
import { getOrders } from "@/lib/admin/orders"

// Semicolon separator, decimal commas and a BOM so the file opens cleanly in
// Finnish-locale Excel.

function field(value: string): string {
  // Customer-controlled text (names, emails) must never start with a formula
  // trigger — Excel/Sheets would execute it on open.
  const neutralized = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[;"\n\r]/.test(neutralized) ? `"${neutralized.replace(/"/g, '""')}"` : neutralized
}

function amount(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",")
}

export async function GET(): Promise<Response> {
  // getOrders(90) fetches a 2× window → the full 180-day horizon, all statuses.
  const { orders } = await getOrders(90)

  const header = [
    "Tilausnumero",
    "Päivämäärä",
    "Asiakas",
    "Sähköposti",
    "Tila",
    "Tuotteita (kpl)",
    "Välisumma",
    "Alennus",
    "Toimitus",
    "Yhteensä",
    "Hyvitetty",
    "Valuutta",
    "Maa",
  ]

  const lines = [
    header,
    ...orders.map((o) => [
      o.number,
      formatDateTime(o.created),
      o.customerName ?? "",
      o.customerEmail ?? "",
      statusLabel(o.status),
      String(o.itemCount),
      amount(o.amountSubtotal),
      amount(o.amountDiscount),
      amount(o.amountShipping),
      amount(o.amountTotal),
      amount(o.amountRefunded),
      o.currency.toUpperCase(),
      o.shippingAddress?.country ?? "",
    ]),
  ]

  const csv = "\uFEFF" + lines.map((row) => row.map(field).join(";")).join("\r\n") + "\r\n"

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="robust-nordic-tilaukset.csv"',
    },
  })
}
