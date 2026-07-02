import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/admin/types"

// Status colors are reserved for state (never reused as series colors) and
// always ship with an icon + label, never color alone.
const STATUS_META: Record<
  OrderStatus,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  paid: {
    label: "Maksettu",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Icon: CheckCircle2,
  },
  open: {
    label: "Kesken",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    Icon: Clock,
  },
  expired: {
    label: "Hylätty",
    className: "bg-slate-50 text-slate-600 border-slate-200",
    Icon: XCircle,
  },
  refunded: {
    label: "Hyvitetty",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: RotateCcw,
  },
  partially_refunded: {
    label: "Osittain hyvitetty",
    className: "bg-rose-50/60 text-rose-700 border-rose-200",
    Icon: RotateCcw,
  },
}

export function statusLabel(status: OrderStatus): string {
  return STATUS_META[status].label
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        meta.className,
        className,
      )}
    >
      <meta.Icon className="size-3" aria-hidden />
      {meta.label}
    </span>
  )
}
