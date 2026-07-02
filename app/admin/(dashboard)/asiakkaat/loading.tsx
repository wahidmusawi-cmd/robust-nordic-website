import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="gap-2 px-5 py-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex max-w-md items-center gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
