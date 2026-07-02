"use client"

import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/admin/empty-state"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <Card>
      <EmptyState
        icon={TriangleAlert}
        title="Jokin meni pieleen"
        description="Tietojen hakeminen epäonnistui. Tämä voi johtua Stripe-yhteyden ongelmasta tai virheellisestä API-avaimesta — tarkista tila Asetukset-sivulta."
        action={
          <div className="flex flex-col items-center gap-3">
            {error.digest && (
              <code className="text-muted-foreground text-xs">Virhekoodi: {error.digest}</code>
            )}
            <Button variant="outline" onClick={reset}>
              Yritä uudelleen
            </Button>
          </div>
        }
      />
    </Card>
  )
}
