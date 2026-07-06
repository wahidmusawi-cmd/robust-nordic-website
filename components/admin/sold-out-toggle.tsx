"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, PackageX, PackageCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleSoldOutAction } from "@/app/adminlog/(dashboard)/tuotteet/actions"

export function SoldOutToggle({ slug, soldOut }: { slug: string; soldOut: boolean }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function toggle() {
    setError(null)
    startTransition(async () => {
      const result = await toggleSoldOutAction(slug, !soldOut)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant={soldOut ? "default" : "outline"} onClick={toggle} disabled={pending}>
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : soldOut ? (
          <PackageCheck className="size-4" aria-hidden />
        ) : (
          <PackageX className="size-4" aria-hidden />
        )}
        {soldOut ? "Palauta myyntiin" : "Merkitse loppuunmyydyksi"}
      </Button>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
