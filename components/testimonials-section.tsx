"use client"

import { useTranslations } from "next-intl"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials")

  const testimonials = [
    { name: t("t1Name"), rating: 5, text: t("t1Text") },
    { name: t("t2Name"), rating: 5, text: t("t2Text") },
  ]

  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground text-balance">{t("title")}</h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed text-pretty">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-medium text-foreground">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="ml-4">
              {t("trustPre")} <strong className="text-foreground">{t("trustCount")}</strong> {t("trustPost")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
