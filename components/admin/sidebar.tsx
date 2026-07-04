"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ExternalLink,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/adminlog", label: "Koti", icon: Home, exact: true },
  { href: "/adminlog/tilaukset", label: "Tilaukset", icon: ShoppingBag },
  { href: "/adminlog/tuotteet", label: "Tuotteet", icon: Package },
  { href: "/adminlog/asiakkaat", label: "Asiakkaat", icon: Users },
  { href: "/adminlog/analytiikka", label: "Analytiikka", icon: BarChart3 },
]

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { href: "/adminlog/asetukset", label: "Asetukset", icon: Settings },
]

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const renderItem = (item: NavItem) => {
    const active = isActive(pathname, item)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <item.icon className="size-4 shrink-0" aria-hidden />
        {item.label}
      </Link>
    )
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Hallinnan navigaatio">
      {NAV_ITEMS.map(renderItem)}
      <div className="mt-auto space-y-1 pt-4">
        {SECONDARY_NAV_ITEMS.map(renderItem)}
        <a
          href="/fi"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          Näytä kauppa
        </a>
      </div>
    </nav>
  )
}

export function AdminBrand() {
  return (
    <Link href="/adminlog" className="flex items-center gap-2 px-5 py-4">
      <span className="text-sm font-bold tracking-[0.14em] uppercase">Robust Nordic</span>
      <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
        Admin
      </span>
    </Link>
  )
}

export function AdminSidebar() {
  return (
    <aside className="bg-sidebar sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r md:flex">
      <AdminBrand />
      <AdminNav />
    </aside>
  )
}
