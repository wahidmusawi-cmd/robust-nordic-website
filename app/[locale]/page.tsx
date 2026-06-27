import { setRequestLocale } from "next-intl/server"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProductsSection } from "@/components/products-section"
import { QualitySection } from "@/components/quality-section"
import { StorySection } from "@/components/story-section"
import { TeamSection } from "@/components/team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import type { Locale } from "@/i18n/routing"

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <QualitySection />
      <StorySection />
      <TeamSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
