import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ChartCardSkeleton({ height = 280 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton style={{ height }} className="w-full" />
      </CardContent>
    </Card>
  )
}

export default function Loading() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-2 px-5 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>

      <ChartCardSkeleton />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCardSkeleton height={240} />
        <ChartCardSkeleton height={240} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCardSkeleton height={240} />
        <ChartCardSkeleton height={240} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCardSkeleton height={120} />
        <ChartCardSkeleton height={120} />
      </div>

      <ChartCardSkeleton height={140} />
    </>
  )
}
