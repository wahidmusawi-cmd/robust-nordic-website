// Part-to-whole as a single horizontal split bar (≤4 segments) with 2px
// surface gaps between fills and a legend keyed by colored dots — identity is
// never carried by color alone. Server-renderable.

import { CHART_SLOTS } from "@/lib/admin/theme"

export type SplitBarSegment = {
  key: string
  label: string
  value: number
  /** Preformatted display value, e.g. "1 234 €" or "64 %". */
  display: string
}

export function SplitBar({ segments }: { segments: SplitBarSegment[] }) {
  const shown = segments.slice(0, CHART_SLOTS.length)
  const total = shown.reduce((s, seg) => s + seg.value, 0)
  if (total <= 0) return null
  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
        {shown.map((seg, i) => (
          <div
            key={seg.key}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: CHART_SLOTS[i],
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {shown.map((seg, i) => (
          <div key={seg.key} className="flex items-center gap-1.5 text-sm">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: CHART_SLOTS[i] }}
              aria-hidden
            />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-medium tabular-nums">{seg.display}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
