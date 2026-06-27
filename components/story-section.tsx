import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function StorySection() {
  const t = useTranslations("home.story")
  return (
    <section id="tarina" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
              {t("title")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t("p1")}</p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{t("p2")}</p>

            <Button
              asChild
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base tracking-wide"
            >
              <Link href="/tarinamme">
                {t("cta")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <img
                src="/brand/berries.jpg"
                alt={t("imageAlt")}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl"
              />
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
