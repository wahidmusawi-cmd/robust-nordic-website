// Wellness quiz: five questions whose ids/option-ids mirror the
// messages/*.json quiz.questions structure — labels come from translations,
// this file carries only the structure and the product scoring.

export type QuizAnswers = Record<string, string[]>

export type QuizOption = {
  id: string
  labelKey: string
  descriptionKey: string
  /** Catalog slugs this answer awards points to. */
  products: string[]
}

export type QuizQuestion = {
  id: string
  questionKey: string
  helperKey?: string
  /** Points per selected answer — the primary "goal" question weighs more. */
  weight: number
  options: QuizOption[]
}

function q(
  id: string,
  weight: number,
  hasHelper: boolean,
  options: Array<[string, string[]]>,
): QuizQuestion {
  return {
    id,
    weight,
    questionKey: `questions.${id}.question`,
    ...(hasHelper ? { helperKey: `questions.${id}.helper` } : {}),
    options: options.map(([optionId, products]) => ({
      id: optionId,
      labelKey: `questions.${id}.options.${optionId}.label`,
      descriptionKey: `questions.${id}.options.${optionId}.description`,
      products,
    })),
  }
}

export const quizQuestions: QuizQuestion[] = [
  q("goal", 3, true, [
    ["energy", ["b12-vitamiini-folaatti", "moringa-luonnon-multivitamiini", "kelp-luonnollinen-jodi"]],
    ["immunity", ["c-vitamiini-pureway-c-sinkki", "reishi-chaga-lions-mane", "biotic-boost-probiootti"]],
    ["sleep", ["quattro-magnesium", "zma-magnesiumglysinaatti"]],
    ["skin", ["biocell-kollageeni-hyaluronihappo", "omega-3-krillioljy"]],
    ["gut", ["biotic-boost-probiootti", "moringa-luonnon-multivitamiini"]],
    ["focus", ["reishi-chaga-lions-mane", "omega-3-krillioljy", "b12-vitamiini-folaatti"]],
  ]),
  q("lifestyle", 1, false, [
    ["athlete", ["amin-x-robust-eaa", "grape-punch-elektrolyytti", "quattro-magnesium"]],
    ["active", ["omega-3-krillioljy", "quattro-magnesium"]],
    ["busy", ["moringa-luonnon-multivitamiini", "b12-vitamiini-folaatti"]],
    ["calm", ["biotic-boost-probiootti", "quattro-magnesium"]],
  ]),
  q("sleep_quality", 1, false, [
    ["poor", ["quattro-magnesium", "zma-magnesiumglysinaatti"]],
    ["restless", ["quattro-magnesium", "airflow-nenateippi"]],
    ["stressed", ["quattro-magnesium", "reishi-chaga-lions-mane"]],
    ["good", []],
  ]),
  q("diet", 1, true, [
    ["plant", ["b12-vitamiini-folaatti", "omega-3-krillioljy"]],
    ["lowfish", ["omega-3-krillioljy"]],
    ["bones", ["bone-boost-kalsium-d3-k2"]],
    ["balanced", ["moringa-luonnon-multivitamiini"]],
  ]),
  q("lifestage", 1, false, [
    ["performance", ["amin-x-robust-eaa", "grape-punch-elektrolyytti"]],
    ["beauty", ["biocell-kollageeni-hyaluronihappo", "omega-3-krillioljy"]],
    ["menopause", ["arctic-menoboost", "quattro-magnesium"]],
    ["general", ["moringa-luonnon-multivitamiini", "c-vitamiini-pureway-c-sinkki"]],
  ]),
]

export function getRecommendations(
  answers: QuizAnswers,
  count: number = 3,
  locale: string = "fi",
): import("./products").Product[] {
  const scores: Record<string, number> = {}

  for (const [questionId, selectedOptions] of Object.entries(answers)) {
    const question = quizQuestions.find((qq) => qq.id === questionId)
    if (!question) continue
    for (const optionId of selectedOptions) {
      const option = question.options.find((o) => o.id === optionId)
      if (!option) continue
      for (const slug of option.products) {
        scores[slug] = (scores[slug] ?? 0) + question.weight
      }
    }
  }

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([slug]) => slug)

  // Import here to avoid a circular dependency at module level.
  const { getProduct } = require("./products") as typeof import("./products")
  return sorted
    .map((slug) => getProduct(slug, locale))
    .filter(Boolean) as import("./products").Product[]
}
