"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Reveal } from "@/components/scroll-effects"

export function HeroSection() {
  const t = useTranslations("hero")
  const bgRef = useRef<HTMLDivElement>(null)

  // Parallax: the background scrolls 30% slower than the content. Transform
  // only (compositor-friendly), rAF-throttled, disabled for reduced motion.
  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Full-width background image — 130% tall so the parallax offset never
          exposes the section edge. */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-x-0 top-0 h-[130%] will-change-transform">
          <img src="/brand/hero-lake.jpg" alt={t("imageAlt")} className="w-full h-full object-cover" />
        </div>
        {/* Readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <Reveal className="max-w-2xl text-center lg:text-left">
          <p className="text-sm tracking-[0.3em] text-accent mb-6">{t("eyebrow")}</p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.05] text-balance">
            {t("titleA")} <span className="italic">{t("titleEm")}</span>
          </h1>

          <p className="mt-8 text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto lg:mx-0">{t("subtitle")}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-accent px-8 py-6 text-base tracking-wide"
            >
              <a href="#tuotteet">
                {t("browse")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base tracking-wide border-foreground/30 hover:bg-foreground/5 bg-background/40 backdrop-blur-sm"
            >
              <Link href="/loyda-tuotteesi">{t("takeTest")}</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-foreground/70 flex items-center gap-2 justify-center lg:justify-start">
            <Truck className="w-4 h-4 text-accent" />
            {t("freeShipping")}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
