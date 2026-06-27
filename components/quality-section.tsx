import Image from "next/image"
import { useTranslations } from "next-intl"
import { Leaf, WheatOff, Droplets, Ban, MapPin, Atom } from "lucide-react"

type Quality = {
  icon: typeof Leaf
  title: string
  description: string
}

function QualityItem({ quality }: { quality: Quality }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-foreground/30 mb-4">
        <quality.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium tracking-[0.12em] uppercase text-foreground">{quality.title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[16rem]">{quality.description}</p>
    </div>
  )
}

export function QualitySection() {
  const t = useTranslations("home.quality")

  const leftQualities: Quality[] = [
    { icon: Leaf, title: t("veganTitle"), description: t("veganDesc") },
    { icon: Droplets, title: t("lactoseTitle"), description: t("lactoseDesc") },
    { icon: MapPin, title: t("madeTitle"), description: t("madeDesc") },
  ]

  const rightQualities: Quality[] = [
    { icon: WheatOff, title: t("glutenTitle"), description: t("glutenDesc") },
    { icon: Ban, title: t("noAdditivesTitle"), description: t("noAdditivesDesc") },
    { icon: Atom, title: t("researchedTitle"), description: t("researchedDesc") },
  ]

  return (
    <section id="laatu" className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-20">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("eyebrow")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">{t("intro")}</p>
        </div>

        {/* Capsule layout: features left + capsule center + features right */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-8 items-center">
          {/* Left features */}
          <div className="flex flex-col gap-12 lg:gap-16 order-2 lg:order-1">
            {leftQualities.map((quality) => (
              <QualityItem key={quality.title} quality={quality} />
            ))}
          </div>

          {/* Center capsule */}
          <div className="flex justify-center order-1 lg:order-2">
            <Image
              src="/brand/capsule-real.webp"
              alt={t("capsuleAlt")}
              width={320}
              height={320}
              className="w-44 sm:w-56 lg:w-64 h-auto"
            />
          </div>

          {/* Right features */}
          <div className="flex flex-col gap-12 lg:gap-16 order-3">
            {rightQualities.map((quality) => (
              <QualityItem key={quality.title} quality={quality} />
            ))}
          </div>
        </div>

        {/* Certification banner */}
        <div className="mt-16 lg:mt-20 bg-primary text-primary-foreground rounded-3xl p-10 lg:p-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-sm tracking-[0.3em] text-accent mb-4">{t("certEyebrow")}</p>
              <h3 className="font-serif text-3xl sm:text-4xl leading-tight text-balance">{t("certTitle")}</h3>
              <p className="mt-5 text-primary-foreground/70 leading-relaxed text-pretty">{t("certBody")}</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-serif text-4xl lg:text-5xl">AA</p>
                <p className="text-xs text-primary-foreground/60 mt-2 tracking-wide">{t("certRatingLabel")}</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-4xl lg:text-5xl">50+</p>
                <p className="text-xs text-primary-foreground/60 mt-2 tracking-wide">{t("certYearsLabel")}</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-4xl lg:text-5xl">{t("certMadeValue")}</p>
                <p className="text-xs text-primary-foreground/60 mt-2 tracking-wide">{t("certMadeLabel")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
