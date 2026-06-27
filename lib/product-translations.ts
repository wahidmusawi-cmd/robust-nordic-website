type Locale = "sv" | "en"

type ProductOverride = {
  name?: string
  shortName?: string
  tagline?: string
  description?: string
  benefits?: string[]
  usage?: string
}

export const productTranslations: Record<string, Record<Locale, Partial<ProductOverride>>> = {
  "biocell-kollageeni-hyaluronihappo": {
    sv: {
      name: "BioCell Kollagen® + Hyaluronsyra",
      shortName: "BioCell Kollagen®",
      tagline: "Hud, leder och bindväv – med patenterad BioCell Kollagen® teknologi",
      description:
        "BioCell Kollagen® är en kliniskt studerad hydrolyserad kollagenmatris som innehåller typ II kollagen, hyaluronsyra och kondroitinsulfat. Den stödjer hudens elasticitet, ledfunktionen och bindvävens hälsa.",
    },
    en: {
      name: "BioCell Collagen® + Hyaluronic Acid",
      shortName: "BioCell Collagen®",
      tagline: "Skin, joints and connective tissue – with patented BioCell Collagen® technology",
      description:
        "BioCell Collagen® is a clinically studied hydrolyzed collagen matrix containing type II collagen, hyaluronic acid and chondroitin sulfate. It supports skin elasticity, joint function and connective tissue health.",
    },
  },
  "quattro-magnesium": {
    sv: {
      name: "Quattro Magnesium",
      tagline: "Fyra magnesiumformer i en kapsel – optimal absorption",
      description:
        "Quattro Magnesium kombinerar fyra olika magnesiumformer: citrat, bisglycinat, malat och taurat. Denna kombination säkerställer utmärkt biotillgänglighet och täcker magnesiumets mångsidiga behov.",
    },
    en: {
      name: "Quattro Magnesium",
      tagline: "Four magnesium forms in one capsule – optimal absorption",
      description:
        "Quattro Magnesium combines four different forms of magnesium: citrate, bisglycinate, malate and taurate. This combination ensures excellent bioavailability and covers magnesium's diverse needs.",
    },
  },
  "lions-mane-sienikapseli": {
    sv: {
      name: "Lion's Mane Svampkapsel",
      shortName: "Lion's Mane",
      tagline: "Stöd för hjärna och nervsystem – med patenterat extrakt",
    },
    en: {
      name: "Lion's Mane Mushroom Capsule",
      shortName: "Lion's Mane",
      tagline: "Brain and nervous system support – with patented extract",
    },
  },
}
