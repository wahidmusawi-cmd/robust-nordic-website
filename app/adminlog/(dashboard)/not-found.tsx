import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/admin/empty-state"

export default function AdminNotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Sivua ei löytynyt"
        description="Etsimääsi sivua tai kohdetta ei ole olemassa. Se on voitu poistaa tai osoite on virheellinen."
        action={
          <Button variant="outline" asChild>
            <Link href="/adminlog">Takaisin yleiskatsaukseen</Link>
          </Button>
        }
      />
    </Card>
  )
}
