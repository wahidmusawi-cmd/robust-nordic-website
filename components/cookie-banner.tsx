"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"

const COOKIE_KEY = "rn_cookie_consent"

export function CookieBanner() {
  const t = useTranslations("cookies")
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setShow(true)
  }, [])

  function choose(value: "all" | "necessary") {
    localStorage.setItem(COOKIE_KEY, value)
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-card border border-border rounded-2xl shadow-2xl p-5"
    >
      <button
        onClick={() => choose("necessary")}
        className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
        aria-label={t("close")}
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {t("title")}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t("body")}</p>

      <div className="flex gap-3">
        <button
          onClick={() => choose("all")}
          className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-xl hover:bg-accent transition-colors"
        >
          {t("acceptAll")}
        </button>
        <button
          onClick={() => choose("necessary")}
          className="flex-1 bg-secondary text-foreground text-sm font-medium py-2.5 rounded-xl hover:bg-secondary/80 transition-colors"
        >
          {t("necessaryOnly")}
        </button>
      </div>
    </div>
  )
}
