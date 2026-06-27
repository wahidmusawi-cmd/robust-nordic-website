import { useTranslations } from "next-intl"
import { Heart, Shield, Sparkles, Truck } from "lucide-react"

export function FeaturesSection() {
  const t = useTranslations("home.features")

  const features = [
    { icon: Heart, title: t("qualityTitle"), description: t("qualityDesc") },
    { icon: Shield, title: t("safeTitle"), description: t("safeDesc") },
    { icon: Truck, title: t("easyTitle"), description: t("easyDesc") },
    { icon: Sparkles, title: t("goodTitle"), description: t("goodDesc") },
  ]

  return (
    <section id="arvot" className="py-24 bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-sm font-medium tracking-wide mb-2">{feature.title.toUpperCase()}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
