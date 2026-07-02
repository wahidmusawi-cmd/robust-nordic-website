import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { computeDelta } from "@/lib/admin/format"
import { Sparkline } from "./charts"

/**
 * KPI tile: label · value (proportional figures — no tabular-nums at display
 * size) · signed delta vs a named period · optional 12-point sparkline.
 */
export function StatCard({
  label,
  value,
  current,
  previous,
  periodLabel = "vs. edellinen jakso",
  /** Set false when a rising number is bad (e.g. abandoned checkouts). */
  positiveIsGood = true,
  spark,
}: {
  label: string
  /** Preformatted display value. */
  value: string
  current?: number
  previous?: number
  periodLabel?: string
  positiveIsGood?: boolean
  spark?: number[]
}) {
  const delta =
    current !== undefined && previous !== undefined ? computeDelta(current, previous) : null
  const good = delta && (delta.direction === "up") === positiveIsGood
  return (
    <Card className="gap-2 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-sm">{label}</p>
        {spark && spark.length > 1 && <Sparkline data={spark} />}
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {delta && delta.direction !== "flat" ? (
        <p className="flex items-center gap-1 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium",
              good ? "text-emerald-700" : "text-rose-700",
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="size-3.5" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden />
            )}
            {delta.text}
          </span>
          <span className="text-muted-foreground">{periodLabel}</span>
        </p>
      ) : delta ? (
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <Minus className="size-3.5" aria-hidden />
          {periodLabel}
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">Ei vertailujaksoa</p>
      )}
    </Card>
  )
}
