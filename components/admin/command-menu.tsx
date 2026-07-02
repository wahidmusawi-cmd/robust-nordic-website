"use client"

// ⌘K quick navigation over admin pages, the product catalog and common
// actions. Built directly on cmdk with a hand-rolled overlay.

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Download, ExternalLink, Search } from "lucide-react"
import { products } from "@/lib/products"
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from "./sidebar"

export function CommandMenu({ stripeUrl }: { stripeUrl: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  function openExternal(url: string) {
    setOpen(false)
    window.open(url, "_blank", "noreferrer")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-input text-muted-foreground hover:border-ring/60 flex h-9 w-full max-w-sm items-center gap-2 rounded-md border bg-white px-3 text-sm transition-colors"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="flex-1 text-left">Haku…</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden rounded px-1.5 py-0.5 font-sans text-[11px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-4 top-[15%] mx-auto max-w-lg">
            <Command
              label="Haku"
              className="overflow-hidden rounded-xl border bg-white shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b px-4">
                <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
                <Command.Input
                  autoFocus
                  placeholder="Hae sivuja, tuotteita, toimintoja…"
                  className="placeholder:text-muted-foreground h-12 w-full bg-transparent text-sm outline-none"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="text-muted-foreground px-3 py-8 text-center text-sm">
                  Ei tuloksia.
                </Command.Empty>
                <Command.Group
                  heading="Sivut"
                  className="text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                >
                  {[...NAV_ITEMS, ...SECONDARY_NAV_ITEMS].map((item) => (
                    <Command.Item
                      key={item.href}
                      value={`sivu ${item.label}`}
                      onSelect={() => go(item.href)}
                      className="data-[selected=true]:bg-secondary text-foreground flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                    >
                      <item.icon className="text-muted-foreground size-4" aria-hidden />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group
                  heading="Tuotteet"
                  className="text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                >
                  {products.map((product) => (
                    <Command.Item
                      key={product.slug}
                      value={`tuote ${product.name}`}
                      onSelect={() => go(`/admin/tuotteet/${product.slug}`)}
                      className="data-[selected=true]:bg-secondary text-foreground flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: product.productColor }}
                        aria-hidden
                      />
                      <span className="truncate">{product.shortName}</span>
                      <span className="text-muted-foreground ml-auto text-xs">{product.price} €</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group
                  heading="Toiminnot"
                  className="text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                >
                  <Command.Item
                    value="toiminto näytä kauppa"
                    onSelect={() => openExternal("/fi")}
                    className="data-[selected=true]:bg-secondary text-foreground flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                  >
                    <ExternalLink className="text-muted-foreground size-4" aria-hidden />
                    Näytä kauppa
                  </Command.Item>
                  <Command.Item
                    value="toiminto stripe dashboard"
                    onSelect={() => openExternal(stripeUrl)}
                    className="data-[selected=true]:bg-secondary text-foreground flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                  >
                    <ExternalLink className="text-muted-foreground size-4" aria-hidden />
                    Avaa Stripe Dashboard
                  </Command.Item>
                  <Command.Item
                    value="toiminto vie tilaukset csv"
                    onSelect={() => openExternal("/admin/tilaukset/vie")}
                    className="data-[selected=true]:bg-secondary text-foreground flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                  >
                    <Download className="text-muted-foreground size-4" aria-hidden />
                    Vie tilaukset (CSV)
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  )
}
