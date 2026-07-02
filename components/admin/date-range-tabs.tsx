"use client"

// Date-range presets — the one filter row that scopes everything below it.
// Uses a transition so the previous render holds (no skeleton flash) while
// the new slice streams in.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseRange, type RangeDays } from "@/lib/admin/types"

const OPTIONS: Array<{ value: RangeDays; label: string }> = [
  { value: 7, label: "7 pv" },
  { value: 30, label: "30 pv" },
  { value: 90, label: "90 pv" },
]

export function DateRangeTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const active = parseRange(searchParams.get("jakso") ?? undefined)

  function select(value: RangeDays) {
    const params = new URLSearchParams(searchParams)
    if (value === 30) params.delete("jakso")
    else params.set("jakso", String(value))
    params.delete("sivu")
    startTransition(() => {
      router.push(`${pathname}${params.size > 0 ? `?${params}` : ""}`, { scroll: false })
    })
  }

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="text-muted-foreground size-4 animate-spin" aria-hidden />}
      <div className="bg-muted inline-flex items-center rounded-lg p-0.5">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => select(option.value)}
            aria-pressed={active === option.value}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active === option.value
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
