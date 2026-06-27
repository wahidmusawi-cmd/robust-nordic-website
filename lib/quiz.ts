export type QuizAnswers = Record<string, string[]>

export type QuizOption = {
  id: string
  labelKey: string
  products: string[]
}

export type QuizQuestion = {
  id: string
  questionKey: string
  options: QuizOption[]
}


export const quizQuestions: QuizQuestion[] = [
  {
    id: "goal",
    questionKey: "q_goal",
    options: [
      { id: "energy", labelKey: "o_energy", products: ["b12-folaatti", "quattro-magnesium", "ashwagandha-ks66"] },
      { id: "sleep", labelKey: "o_sleep", products: ["unikombo-magnesium-l-tryptofaani", "reishi-sienikapseli", "ashwagandha-ks66"] },
      { id: "joints", labelKey: "o_joints", products: ["biocell-kollageeni-hyaluronihappo", "omega-3-krillioljy", "omega-3-kalaoljy"] },
      { id: "immunity", labelKey: "o_immunity", products: ["c-vitamiini-bioflavonoidit", "d3-k2-vitamiini", "biotic-boost-probiootti"] },
    ],
  },
  {
    id: "concern",
    questionKey: "q_concern",
    options: [
      { id: "brain", labelKey: "o_brain", products: ["lions-mane-sienikapseli", "omega-3-krillioljy", "b12-folaatti"] },
      { id: "gut", labelKey: "o_gut", products: ["biotic-boost-probiootti", "omega-3-kalaoljy", "c-vitamiini-bioflavonoidit"] },
      { id: "stress", labelKey: "o_stress", products: ["ashwagandha-ks66", "reishi-sienikapseli", "quattro-magnesium"] },
      { id: "skin", labelKey: "o_skin", products: ["biocell-kollageeni-hyaluronihappo", "c-vitamiini-bioflavonoidit", "omega-3-krillioljy"] },
    ],
  },
  {
    id: "activity",
    questionKey: "q_activity",
    options: [
      { id: "athlete", labelKey: "o_athlete", products: ["quattro-magnesium", "omega-3-krillioljy", "biocell-kollageeni-hyaluronihappo"] },
      { id: "active", labelKey: "o_active", products: ["quattro-magnesium", "b12-folaatti", "omega-3-kalaoljy"] },
      { id: "moderate", labelKey: "o_moderate", products: ["biotic-boost-probiootti", "d3-k2-vitamiini", "ashwagandha-ks66"] },
      { id: "sedentary", labelKey: "o_sedentary", products: ["d3-k2-vitamiini", "omega-3-kalaoljy", "c-vitamiini-bioflavonoidit"] },
    ],
  },
  {
    id: "mushrooms",
    questionKey: "q_mushrooms",
    options: [
      { id: "focus", labelKey: "o_focus", products: ["lions-mane-sienikapseli", "b12-folaatti", "ashwagandha-ks66"] },
      { id: "immune_m", labelKey: "o_immune_m", products: ["reishi-sienikapseli", "chaga-sienikapseli", "c-vitamiini-bioflavonoidit"] },
      { id: "antioxidant", labelKey: "o_antioxidant", products: ["chaga-sienikapseli", "c-vitamiini-bioflavonoidit", "omega-3-krillioljy"] },
      { id: "no_mushrooms", labelKey: "o_no_mushrooms", products: [] },
    ],
  },
]

export function getRecommendations(answers: QuizAnswers, count: number = 3, locale: string = "fi"): import("./products").Product[] {
  const scores: Record<string, number> = {}

  for (const [questionId, selectedOptions] of Object.entries(answers)) {
    const question = quizQuestions.find((q) => q.id === questionId)
    if (!question) continue
    for (const optionId of selectedOptions) {
      const option = question.options.find((o) => o.id === optionId)
      if (!option) continue
      option.products.forEach((slug, i) => {
        scores[slug] = (scores[slug] ?? 0) + (3 - i)
      })
    }
  }

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([slug]) => slug)

  // Import products here to avoid circular dependency at module level
  const { getProduct } = require("./products") as typeof import("./products")
  return sorted.map((slug) => getProduct(slug, locale)).filter(Boolean) as import("./products").Product[]
}
