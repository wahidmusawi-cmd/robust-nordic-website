// Shopify-style ranked list with proportional fills. Nominal categories share
// one hue (bar length already encodes the value); the unfilled track is a
// lighter step of the same ramp. Server-renderable — plain HTML/CSS.

import Image from "next/image"
import Link from "next/link"
import { CHART } from "@/lib/admin/theme"

export type BarListRow = {
  key: string
  label: string
  value: number
  /** Preformatted display value, e.g. "1 234 €". */
  display: string
  /** Secondary text under/next to the label, e.g. "12 kpl". */
  hint?: string
  image?: string | null
  href?: string
}

export function BarList({ rows }: { rows: BarListRow[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const width = row.value <= 0 ? 0 : Math.max(2, Math.round((row.value / max) * 100))
        const label = (
          <span className="flex min-w-0 items-center gap-2">
            {row.image && (
              <Image
                src={row.image}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-sm bg-secondary object-contain"
              />
            )}
            <span className="truncate text-sm">{row.label}</span>
            {row.hint && <span className="text-muted-foreground shrink-0 text-xs">{row.hint}</span>}
          </span>
        )
        return (
          <div key={row.key} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              {row.href ? (
                <Link href={row.href} className="min-w-0 hover:underline">
                  {label}
                </Link>
              ) : (
                label
              )}
              <span className="shrink-0 text-sm font-medium tabular-nums">{row.display}</span>
            </div>
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: CHART.track }}>
              <div
                className="h-2 rounded-full"
                style={{ width: `${width}%`, backgroundColor: CHART.c1 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
