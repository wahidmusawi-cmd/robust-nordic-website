import Link from "next/link"
import { SearchX } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function OrderNotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Tilausta ei löytynyt"
        description="Tilausta ei ole olemassa tai tunniste on virheellinen."
        action={
          <Button variant="outline" asChild>
            <Link href="/adminlog/tilaukset">Takaisin tilauksiin</Link>
          </Button>
        }
      />
    </Card>
  )
}
