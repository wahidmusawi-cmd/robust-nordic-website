"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight, ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { quizQuestions, getRecommendations, type QuizAnswers } from "@/lib/quiz"
import { getBuyUrl } from "@/lib/products"

type Stage = "intro" | "questions" | "results"

export function WellnessQuiz() {
  const t = useTranslations("quiz")
  const locale = useLocale()
  const [stage, setStage] = useState<Stage>("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const total = quizQuestions.length
  const current = quizQuestions[step]
  const progress = Math.round(((step + (stage === "results" ? 1 : 0)) / total) * 100)

  function toggleOption(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const existing = prev[questionId] || []
      // Yksivalintainen: korvaa aiempi valinta
      return { ...prev, [questionId]: existing.includes(optionId) ? [] : [optionId] }
    })
  }

  function next() {
    if (step < total - 1) {
      setStep(step + 1)
    } else {
      setStage("results")
    }
  }

  function back() {
    if (step > 0) setStep(step - 1)
    else setStage("intro")
  }

  function restart() {
    setAnswers({})
    setStep(0)
    setStage("intro")
  }

  const currentAnswered = (answers[current?.id]?.length ?? 0) > 0

  // ---------- INTRO ----------
  if (stage === "intro") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-1.5 text-sm tracking-wide mb-6">
          <Sparkles className="w-4 h-4" />
          {t("badge")}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
          {t("introTitle")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">{t("introText")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" /> {t("feature1")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" /> {t("feature2")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" /> {t("feature3")}
          </span>
        </div>
        <Button
          size="lg"
          onClick={() => setStage("questions")}
          className="mt-10 px-10 py-6 text-base tracking-wide bg-primary text-primary-foreground hover:bg-accent"
        >
          {t("start")}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    )
  }

  // ---------- RESULTS ----------
  if (stage === "results") {
    const recommendations = getRecommendations(answers, 3, locale)
    const [hero, ...rest] = recommendations
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-1.5 text-sm tracking-wide mb-6">
            <Sparkles className="w-4 h-4" />
            {t("resultsBadge")}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight text-balance">
            {t("resultsTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">{t("resultsText")}</p>
        </div>

        {/* Hero recommendation */}
        {hero && (
          <div className="mt-12 bg-card rounded-3xl border border-border overflow-hidden shadow-sm grid md:grid-cols-2">
            <div className="relative bg-secondary/40 flex items-center justify-center p-10">
              <span className="absolute top-4 left-4 text-[10px] tracking-wider uppercase bg-accent text-accent-foreground px-3 py-1 rounded-full">
                {t("bestMatch")}
              </span>
              <img
                src={hero.image || "/placeholder.svg"}
                alt={hero.name}
                className="w-full max-w-[260px] h-auto object-contain"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              {hero.size && <p className="text-xs tracking-wider text-muted-foreground uppercase">{hero.size}</p>}
              <h3 className="font-serif text-2xl lg:text-3xl text-foreground mt-1 text-balance">{hero.name}</h3>
              <p className="text-accent text-sm mt-1">{hero.tagline}</p>
              <p className="text-muted-foreground mt-4 leading-relaxed line-clamp-3">{hero.description}</p>
              <div className="flex items-center gap-3 mt-6">
                <span className="text-2xl font-semibold text-foreground">{hero.price} €</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-accent px-6 py-5 tracking-wide">
                  <a href={getBuyUrl(hero.slug)} target="_blank" rel="noopener noreferrer">
                    {t("buyNow")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="px-6 py-5 tracking-wide border-foreground/20 bg-transparent">
                  <Link href={`/tuotteet/${hero.slug}`}>{t("readMore")}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary recommendations */}
        {rest.length > 0 && (
          <>
            <h3 className="font-serif text-xl text-foreground mt-12 mb-6 text-center">{t("complement")}</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {rest.map((p) => (
                <Link
                  key={p.slug}
                  href={`/tuotteet/${p.slug}`}
                  className="group flex items-center gap-5 bg-card rounded-2xl border border-border/60 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex-shrink-0 w-24 h-24 bg-secondary/40 rounded-xl flex items-center justify-center p-2">
                    <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-semibold text-foreground leading-snug text-balance">{p.name}</h4>
                    <p className="text-sm text-accent mt-0.5">{p.tagline}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-foreground">{p.price} €</span>
                      <span className="inline-flex items-center text-sm font-medium text-accent gap-1 group-hover:gap-2 transition-all">
                        {t("view")} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button variant="outline" onClick={restart} className="px-6 py-5 tracking-wide border-foreground/20 bg-transparent">
            <RotateCcw className="mr-2 w-4 h-4" />
            {t("restart")}
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-accent px-6 py-5 tracking-wide">
            <Link href="/tuotteet">
              {t("browseAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // ---------- QUESTIONS ----------
  const qKey = `questions.${current.id}`
  const hasHelper = current.id === "goal" || current.id === "diet"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>
            {t("questionLabel")} {step + 1} {t("of")} {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight text-balance">
        {t(`${qKey}.question`)}
      </h2>
      {hasHelper && <p className="mt-3 text-muted-foreground leading-relaxed">{t(`${qKey}.helper`)}</p>}

      {/* Options */}
      <div className="mt-8 grid gap-3">
        {current.options.map((option) => {
          const selected = (answers[current.id] || []).includes(option.id)
          const label = t(`${qKey}.options.${option.id}.label`)
          const description = t(`${qKey}.options.${option.id}.description`)
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(current.id, option.id)}
              className={`group flex items-center gap-4 text-left rounded-xl border p-4 sm:p-5 transition-all ${
                selected
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-border bg-card hover:border-accent/50 hover:bg-secondary/40"
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selected ? "border-accent bg-accent text-accent-foreground" : "border-muted-foreground/40"
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5" />}
              </span>
              <span className="flex-1">
                <span className="block font-medium text-foreground">{label}</span>
                {description && <span className="block text-sm text-muted-foreground mt-0.5">{description}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <Button variant="ghost" onClick={back} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 w-4 h-4" />
          {t("back")}
        </Button>
        <Button
          onClick={next}
          disabled={!currentAnswered}
          className="bg-primary text-primary-foreground hover:bg-accent px-8 py-5 tracking-wide disabled:opacity-40"
        >
          {step === total - 1 ? t("showResults") : t("nextStep")}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
