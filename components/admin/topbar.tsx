"use client"

import { useState } from "react"
import { ExternalLink, LogOut, Menu, Settings, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { CommandMenu } from "./command-menu"
import { AdminBrand, AdminNav } from "./sidebar"

export function AdminTopbar({
  stripeUrl,
  unprotected,
  onLogout,
}: {
  stripeUrl: string
  /** True when running without ADMIN_PASSWORD in development. */
  unprotected: boolean
  onLogout: () => Promise<void>
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur md:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Avaa valikko">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigaatio</SheetTitle>
          <div className="flex h-full flex-col">
            <AdminBrand />
            <AdminNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 justify-start md:max-w-md">
        <CommandMenu stripeUrl={stripeUrl} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {unprotected && (
          <span className="border-amber-200 bg-amber-50 text-amber-900 hidden items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium sm:inline-flex">
            <ShieldAlert className="size-3.5" aria-hidden />
            Kehitystila – ei salasanaa
          </span>
        )}
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <a href="/fi" target="_blank" rel="noreferrer">
            Näytä kauppa
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Käyttäjävalikko"
              className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold"
            >
              RN
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Robust Nordic</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/adminlog/asetukset">
                <Settings className="size-4" aria-hidden />
                Asetukset
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={stripeUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                Stripe Dashboard
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                void onLogout()
              }}
            >
              <LogOut className="size-4" aria-hidden />
              Kirjaudu ulos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
