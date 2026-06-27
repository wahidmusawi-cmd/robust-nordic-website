"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { ChevronDown, Check } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// flagcdn country codes per locale (sv -> Sweden, en -> European Union)
const FLAGS: Record<Locale, { code: string; short: string }> = {
  fi: { code: "fi", short: "FI" },
  sv: { code: "se", short: "SV" },
  en: { code: "eu", short: "EN" },
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const t = useTranslations("langSwitcher")
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  const current = FLAGS[locale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label={t("label")}
        className={cn(
          "flex items-center gap-1.5 rounded-sm px-1.5 py-1 ring-1 ring-border transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
      >
        <span className="relative h-5 w-7 overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://flagcdn.com/w40/${current.code}.png`}
            alt={t(locale)}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="text-xs font-medium">{current.short}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {routing.locales.map((loc) => {
          const flag = FLAGS[loc]
          const active = loc === locale
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => switchTo(loc)}
              className="flex items-center gap-2.5"
              aria-current={active ? "true" : undefined}
            >
              <span className="relative h-4 w-6 overflow-hidden rounded-sm ring-1 ring-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w40/${flag.code}.png`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex-1 text-sm">{t(loc)}</span>
              {active && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
