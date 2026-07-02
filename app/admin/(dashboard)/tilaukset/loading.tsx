import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      {/* Header: title + range tabs + export */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Status chips + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-9 w-full sm:w-80" />
      </div>

      {/* Table */}
      <Card className="gap-0 overflow-hidden py-0">
        <div className="border-b px-5 py-3">
          <Skeleton className="h-4 w-2/3" />
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="hidden h-4 w-14 sm:block" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
          <Skeleton className="h-4 w-44" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </Card>
    </>
  )
}
