"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

type NavItem = {
  key: string
  href: string
  children?: { key: string; href: string }[]
}

const navItems: NavItem[] = [
  { key: "products", href: "/tuotteet" },
  { key: "test", href: "/loyda-tuotteesi" },
  { key: "quality", href: "/laatu-ja-luottamus" },
  {
    key: "articles",
    href: "/blogi",
    children: [
      { key: "blog", href: "/blogi" },
      { key: "sponsors", href: "/sponsoritarinat" },
    ],
  },
  {
    key: "info",
    href: "/yhteystiedot",
    children: [
      { key: "story", href: "/tarinamme" },
      { key: "contact", href: "/yhteystiedot" },
      { key: "faq", href: "/ukk" },
    ],
  },
]

export function SiteHeader() {
  const t = useTranslations("nav")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Glassmorphism on scroll: transparent at the top, frosted glass once the
  // page moves under the header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || mobileOpen
          ? "bg-background/70 backdrop-blur-xl border-border shadow-sm supports-[not(backdrop-filter:blur(0))]:bg-background/95"
          : "bg-transparent border-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Logo priority className="shrink-0" />

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.key} className="relative group">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2">
                    {t(item.key)}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card rounded-xl shadow-lg border border-border py-2 min-w-48">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                >
                  {t(item.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5">
          <LanguageSwitcher />
          <Button asChild className="bg-primary text-primary-foreground hover:bg-accent tracking-wide">
            <Link href="/tuotteet">{t("buyNow")}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("openMenu")}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <ul className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.key}>
                {item.children ? (
                  <div>
                    <button
                      className="w-full flex items-center justify-between py-3 text-base font-medium text-foreground"
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                    >
                      {t(item.key)}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openDropdown === item.key ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.key && (
                      <div className="pl-4 pb-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2 text-sm text-foreground/70"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t(child.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3 text-base font-medium text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-2">
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-accent">
                <Link href="/tuotteet" onClick={() => setMobileOpen(false)}>
                  {t("buyNow")}
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
