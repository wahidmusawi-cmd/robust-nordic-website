"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { Reveal } from "@/components/scroll-effects"

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterSection() {
  const t = useTranslations("home.newsletter")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading" || status === "success") return

    const trimmed = email.trim()
    if (!trimmed) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        setStatus("success")
        setMessage(t("success"))
        setEmail("")
        return
      }

      if (res.status === 429) {
        setStatus("error")
        setMessage(t("errorGeneric"))
        return
      }

      if (data.error === "INVALID_EMAIL") {
        setStatus("error")
        setMessage(t("errorInvalid"))
        return
      }

      setStatus("error")
      setMessage(t("errorGeneric"))
    } catch {
      setStatus("error")
      setMessage(t("errorGeneric"))
    }
  }

  return (
    <section className="py-24 lg:py-32 bg-card text-foreground">
      <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
        <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">{t("title")}</h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>

        {status === "success" ? (
          <div className="mt-10 flex items-center justify-center gap-3 text-green-600">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <p className="font-medium text-lg">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              placeholder={t("placeholder")}
              required
              disabled={status === "loading"}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 whitespace-nowrap disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  {t("submit")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-destructive">{message}</p>
        )}

        <p className="mt-4 text-sm text-muted-foreground">{t("disclaimer")}</p>
      </Reveal>
    </section>
  )
}
