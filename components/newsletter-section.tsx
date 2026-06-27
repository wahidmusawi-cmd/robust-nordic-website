"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const t = useTranslations("home.newsletter")
  return (
    <section className="py-24 lg:py-32 bg-card text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
        <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">{t("title")}</h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>

        {/* Newsletter form */}
        <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder={t("placeholder")}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent"
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 whitespace-nowrap">
            {t("submit")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </section>
  )
}
