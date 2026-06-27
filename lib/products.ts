import { productTranslations } from "./product-translations"

export type Product = {
  slug: string
  name: string
  shortName: string
  size?: string
  price: string
  image: string
  category: "ravintolisat" | "hyvinvointi"
  tagline: string
  description: string
  benefits: string[]
  ingredients?: string
  usage?: string
  badge?: string
  productColor: string
}

type Locale = "fi" | "sv" | "en"

// Shopify product handle mapping (slug → Shopify handle)
const liveHandles: Record<string, string> = {
  "biocell-kollageeni-hyaluronihappo": "biocell-kollageeni-hyaluronihappo",
  "quattro-magnesium": "quattro-magnesium",
  "omega-3-krillioljy": "omega-3-krillioljy",
  "biotic-boost-probiootti": "biotic-boost-probiootti",
  "lions-mane-sienikapseli": "lions-mane-sienikapseli",
  "reishi-sienikapseli": "reishi-sienikapseli",
  "chaga-sienikapseli": "chaga-sienikapseli",
  "d3-k2-vitamiini": "d3-k2-vitamiini",
  "b12-folaatti": "b12-folaatti",
  "c-vitamiini-bioflavonoidit": "c-vitamiini-bioflavonoidit",
  "ashwagandha-ks66": "ashwagandha-ks66",
  "omega-3-kalaoljy": "omega-3-kalaoljy",
  "unikombo-magnesium-l-tryptofaani": "unikombo-magnesium-l-tryptofaani",
}

export function getBuyUrl(slug: string): string {
  const handle = liveHandles[slug] ?? slug
  return `https://robustnordic.fi/products/${handle}`
}

// Base Finnish product data
const baseProducts: Product[] = [
  {
    slug: "biocell-kollageeni-hyaluronihappo",
    name: "BioCell Kollageeni® + Hyaluronihappo",
    shortName: "BioCell Kollageeni®",
    size: "120 kapselia",
    price: "42,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/biocell-kollageen.jpg",
    category: "ravintolisat",
    tagline: "Iho, nivelet ja sidekudos – patentoidulla BioCell Kollageeni® -teknologialla",
    description:
      "BioCell Kollageeni® on kliinisesti tutkittu hydrolysoitu kollageenimatriisi, joka sisältää tyypin II kollageenia, hyaluronihappoa ja kondroitiinisulfaattia. Se tukee ihon elastisuutta, nivelten toimintaa ja sidekudoksen terveyttä.",
    benefits: [
      "Tukee ihon kosteutta ja elastisuutta",
      "Edistää nivelten liikkuvuutta",
      "Sisältää hyaluronihappoa ja kondroitiinisulfaattia",
      "Kliinisesti tutkittu BioCell Kollageeni®",
      "Valmistettu Suomessa",
    ],
    ingredients: "BioCell Kollageeni® (hydrolysoitu tyypin II kollageeni, hyaluronihappo, kondroitiinisulfaatti), kapselinkuori (HPMC).",
    usage: "2 kapselia päivittäin ruuan kanssa.",
    badge: "Bestseller",
    productColor: "#1a4f80",
  },
  {
    slug: "quattro-magnesium",
    name: "Quattro Magnesium",
    shortName: "Quattro Magnesium",
    size: "90 kapselia",
    price: "34,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/quattro-magnesium.jpg",
    category: "ravintolisat",
    tagline: "Neljä magnesiummuotoa yhdessä kapselissa – optimaalinen imeytyminen",
    description:
      "Quattro Magnesium yhdistää neljä erilaista magnesiumin muotoa: sitraatin, bisglysinaatin, malaaatin ja tauraatin. Tämä yhdistelmä varmistaa erinomaisen biosaatavuuden ja kattaa magnesiumin moninaiset tarpeet.",
    benefits: [
      "Neljä magnesiummuotoa optimaaliseen imeytymiseen",
      "Tukee lihasten normaalia toimintaa",
      "Edistää hermoston normaalia toimintaa",
      "Auttaa vähentämään väsymystä",
      "Tukee normaalia psykologista toimintaa",
    ],
    ingredients: "Magnesiumsitraatti, magnesiumbisglysinaatti, magnesiummalaaatti, magnesiumtauraatti, kapselinkuori (HPMC).",
    usage: "3 kapselia päivittäin ruuan kanssa.",
    productColor: "#6590b2",
  },
  {
    slug: "omega-3-krillioljy",
    name: "Omega-3 Krilliöljy",
    shortName: "Krilliöljy",
    size: "60 kapselia",
    price: "36,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/omega3-krillioljy.jpg",
    category: "ravintolisat",
    tagline: "Luonnollinen krilliöljy EPA:lla, DHA:lla ja astaksantiinilla",
    description:
      "Krilliöljy on erityinen omega-3:n lähde, sillä sen rasvahapot ovat fosfolipidimuodossa, mikä parantaa imeytymistä merkittävästi verrattuna tavalliseen kalaöljyyn. Sisältää myös luonnollista astaksantiinia.",
    benefits: [
      "Fosfolipidimuotoinen omega-3 – parempi imeytyminen",
      "Tukee sydämen ja aivojen terveyttä",
      "Sisältää luonnollista astaksantiinia",
      "Ei kalaöljyn hajua tai sivumakua",
      "Kestävästä lähtökohdasta",
    ],
    ingredients: "Krilliöljy (Euphausia superba), gelatiinikapselikuori, glyseroli.",
    usage: "2 kapselia päivittäin ruuan yhteydessä.",
    badge: "Uutuus",
    productColor: "#d2534f",
  },
  {
    slug: "biotic-boost-probiootti",
    name: "Biotic Boost Probiootti",
    shortName: "Biotic Boost",
    size: "60 kapselia",
    price: "32,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/biotic-boost.jpg",
    category: "ravintolisat",
    tagline: "10 miljardia bakteerikantaa – suoliston ja immuunijärjestelmän tuki",
    description:
      "Biotic Boost sisältää 10 erilaista probioottikantaa, joilla on yhteensä 10 miljardia CFU per kapseli. Kansien suojaava enteropäällyste varmistaa, että bakteerit saavuttavat suoliston elossa.",
    benefits: [
      "10 miljardia CFU per kapseli",
      "10 erilaista probioottikantaa",
      "Tukee suoliston tasapainoa",
      "Vahvistaa immuunijärjestelmää",
      "Enteropäällyste – bakteerit säilyvät elossa",
    ],
    ingredients: "Probioottiseos (Lactobacillus acidophilus, L. rhamnosus, L. plantarum, Bifidobacterium longum, B. bifidum), prebiootit (inuliini), HPMC-kapselikuori.",
    usage: "1 kapseli päivittäin tyhjään mahaan.",
    productColor: "#2d7d52",
  },
  {
    slug: "lions-mane-sienikapseli",
    name: "Lion's Mane Sienikapseli",
    shortName: "Lion's Mane",
    size: "60 kapselia",
    price: "38,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/lions-mane.jpg",
    category: "hyvinvointi",
    tagline: "Aivojen ja hermoston tuki – patentoidulla uutteella",
    description:
      "Lion's Mane (Hericium erinaceus) on erikoissieni, joka tunnetaan aivojen toimintaa tukevista ominaisuuksistaan. Sisältää hericenoneita ja erinacineita, jotka tukevat hermokasvutekijän (NGF) tuotantoa.",
    benefits: [
      "Tukee kognitiivista toimintaa ja muistia",
      "Edistää hermoston terveyttä",
      "Tukee mielialaa ja stressinhallintaa",
      "Uute hedelmäkehosta (30% polysakkaridiit)",
      "Vegaaninen ja gluteeniton",
    ],
    ingredients: "Lion's Mane -sienikuivausuute (Hericium erinaceus, hedelmäkeho, 30% polysakkaridiit), HPMC-kapselikuori.",
    usage: "2 kapselia päivittäin.",
    badge: "Suosittu",
    productColor: "#8b6b4a",
  },
  {
    slug: "reishi-sienikapseli",
    name: "Reishi Sienikapseli",
    shortName: "Reishi",
    size: "60 kapselia",
    price: "36,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/reishi.jpg",
    category: "hyvinvointi",
    tagline: "Kuninkaallinen sieni – immuunijärjestelmän ja unen tuki",
    description:
      "Reishi (Ganoderma lucidum) on yksi maailman arvostetuimmista lääkekasveista. Se sisältää beetaglukaaneja ja triterpenoideja, jotka tukevat immuunijärjestelmää ja edistävät rentoutumista.",
    benefits: [
      "Tukee immuunijärjestelmän toimintaa",
      "Edistää rentoutumista ja unen laatua",
      "Adaptogeen – auttaa stressinhallinnassa",
      "Sisältää beetaglukaaneja ja triterpenoideja",
      "Luonnonmukainen viljely",
    ],
    ingredients: "Reishi-sienikuivausuute (Ganoderma lucidum, 30% polysakkaridiit, 2% triterpenoidit), HPMC-kapselikuori.",
    usage: "2 kapselia illalla ruuan kanssa.",
    productColor: "#7b3f3f",
  },
  {
    slug: "chaga-sienikapseli",
    name: "Chaga Sienikapseli",
    shortName: "Chaga",
    size: "60 kapselia",
    price: "34,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/chaga.jpg",
    category: "hyvinvointi",
    tagline: "Pohjoisen superruoka – antioksidanttien kuningas",
    description:
      "Chaga (Inonotus obliquus) kasvaa Pohjois-Euroopan ja Venäjän koivumetsissä. Se on yksi antioksidanttirikkaimmista luonnontuotteista ja on käytetty perinteisessä pohjoismaisessa kansanlääkinnässä vuosisatoja.",
    benefits: [
      "Erittäin korkea antioksidanttipitoisuus (ORAC)",
      "Tukee immuunijärjestelmää",
      "Edistää ihon terveyttä",
      "Kerätty luonnosta Skandinaviasta",
      "Ei lisäaineita",
    ],
    ingredients: "Chaga-sienikuivausuute (Inonotus obliquus, 30% polysakkaridiit), HPMC-kapselikuori.",
    usage: "2 kapselia päivittäin.",
    productColor: "#5c4523",
  },
  {
    slug: "d3-k2-vitamiini",
    name: "D3 + K2 Vitamiini",
    shortName: "D3 + K2",
    size: "90 kapselia",
    price: "28,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/d3-k2.jpg",
    category: "ravintolisat",
    tagline: "D3 ja K2 yhdessä – luusto, immuuni ja sydän",
    description:
      "D3-vitamiini ja K2-vitamiini (MK-7) toimivat synergisesti: D3 auttaa kalsiumin imeytymisessä, K2 ohjaa kalsiumin luustoon sen sijaan, että se kertyisi valtimoihin.",
    benefits: [
      "Tukee luuston ja hampaiden terveyttä",
      "D3 5000 IU + K2 (MK-7) 100 µg",
      "Tukee immuunijärjestelmää",
      "Edistää sydämen terveyttä",
      "Vegaaninen D3 (lanoliinivapaa vaihtoehto saatavilla)",
    ],
    ingredients: "Kolekalsifedioli (D3-vitamiini), menakinoni-7 (K2-vitamiini MK-7), MCT-öljy, HPMC-kapselikuori.",
    usage: "1 kapseli päivittäin ruuan kanssa.",
    productColor: "#d4a017",
  },
  {
    slug: "b12-folaatti",
    name: "B12 + Folaatti",
    shortName: "B12 + Folaatti",
    size: "90 tablettia",
    price: "24,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/b12-folaatti.jpg",
    category: "ravintolisat",
    tagline: "Aktiivinen B12 ja 5-MTHF folaatti – energia ja hermoston tuki",
    description:
      "Tämä tuote sisältää aktiivista B12-vitamiinia (metyylikobalamiini) sekä aktiivista folaattimuotoa (5-MTHF), joka on biosaatavammassa muodossa kuin tavallinen foolihappo. Yhdessä ne tukevat energiaa ja hermoston toimintaa.",
    benefits: [
      "Aktiivinen B12 (metyylikobalamiini) 1000 µg",
      "5-MTHF folaatti – paremmin imeytyvä muoto",
      "Tukee hermoston ja immuunijärjestelmän toimintaa",
      "Vähentää väsymystä",
      "Tukee punasolujen muodostumista",
    ],
    ingredients: "Metyylikobalamiini (B12-vitamiini), 5-metyylitertahydrofolaatti (folaatti), täyteaine (mikrokristalliinen selluloosa).",
    usage: "1 tabletti päivittäin.",
    productColor: "#3a5fa5",
  },
  {
    slug: "ashwagandha-ks66",
    name: "Ashwagandha KS66®",
    shortName: "Ashwagandha",
    size: "60 kapselia",
    price: "36,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/ashwagandha.jpg",
    category: "hyvinvointi",
    tagline: "Stressinhallintaan – patentoitu KS66® ashwagandha-uute",
    description:
      "Ashwagandha (Withania somnifera) on ayurveda-lääketieteen keskeinen adaptogeen. KS66®-uute on kliinisesti tutkittu ja sisältää 5% witanolideita, jotka tukevat stressinhallintaa ja palautumista.",
    benefits: [
      "Patentoitu KS66® uute – 5% witanolideja",
      "Kliinisesti tutkittu stressinhallintaan",
      "Tukee palautumista ja unen laatua",
      "Edistää normaalia energiatasoa",
      "Adaptogeen – kehon mukautumiskyky stressiin",
    ],
    ingredients: "Ashwagandha-juuriuute (Withania somnifera, KS66®, 5% witanolideja), HPMC-kapselikuori.",
    usage: "1–2 kapselia päivittäin ruuan kanssa.",
    productColor: "#8b5e3c",
  },
  {
    slug: "unikombo-magnesium-l-tryptofaani",
    name: "Unikombo – Magnesium + L-Tryptofaani",
    shortName: "Unikombo",
    size: "60 kapselia",
    price: "32,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/unikombo.jpg",
    category: "hyvinvointi",
    tagline: "Luonnollinen univalmiste – magnesium ja L-tryptofaani",
    description:
      "Unikombo yhdistää magnesiumbisglysinaatin (rauhoittava magnesiummuoto) ja L-tryptofaanin, joka on serotoniinin ja melatoniinin esiaste. Yhdessä ne edistävät luonnollista, laadukasta unta.",
    benefits: [
      "Edistää nukahtamista luonnollisesti",
      "Magnesiumbisglysinaatti – rauhoittava muoto",
      "L-tryptofaani – serotoniinin esiaste",
      "Ei riippuvuutta",
      "Sopii pitkäaikaiseen käyttöön",
    ],
    ingredients: "L-tryptofaani, magnesiumbisglysinaatti, HPMC-kapselikuori.",
    usage: "2 kapselia 30–60 min ennen nukkumaanmenoa.",
    productColor: "#2c3e6b",
  },
  {
    slug: "c-vitamiini-bioflavonoidit",
    name: "C-vitamiini + Bioflavonoidit",
    shortName: "C-vitamiini",
    size: "90 tablettia",
    price: "22,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/c-vitamiini.jpg",
    category: "ravintolisat",
    tagline: "Vahvistettu C-vitamiini bioflavonoideilla – immuunisuoja",
    description:
      "C-vitamiini on keskeinen antioksidantti ja immuunijärjestelmän rakentaja. Bioflavonoidit (hesperidiini, rutiini) parantavat C-vitamiinin imeytymistä ja vahvistavat hiussuonistoa.",
    benefits: [
      "1000 mg C-vitamiinia per tabletti",
      "Bioflavonoidit parantavat imeytymistä",
      "Tukee immuunijärjestelmää",
      "Edistää kollageenin muodostumista",
      "Antioksidanttisuoja",
    ],
    ingredients: "L-askorbiinihappo (C-vitamiini), sitrusbioflavonoidit (hesperidiini, rutiini), täyteaine.",
    usage: "1 tabletti päivittäin ruuan kanssa.",
    productColor: "#e07b39",
  },
  {
    slug: "omega-3-kalaoljy",
    name: "Omega-3 Kalaöljy",
    shortName: "Kalaöljy",
    size: "90 kapselia",
    price: "28,90",
    image: "https://cdn.shopify.com/s/files/1/0735/6023/4323/files/omega3-kalaoljy.jpg",
    category: "ravintolisat",
    tagline: "Korkealaatuinen kalaöljy – 60% omega-3 EPA+DHA",
    description:
      "Korkealaatuinen kalaöljy pohjoisen kylmien vesien kalasta. Sisältää 60% omega-3-rasvahappoja, joista EPA ja DHA -muodossa. IFOS-sertifioitu puhtaus ja laatu.",
    benefits: [
      "60% omega-3 (EPA + DHA)",
      "IFOS-sertifioitu puhtaus",
      "Tukee sydämen terveyttä",
      "Edistää aivojen toimintaa",
      "Ei kalan hajua – enterokapselit",
    ],
    ingredients: "Kalaöljy (Engraulis encrasicolus), gelatiinikapselikuori, glyseroli, tokoferoli (E-vitamiini).",
    usage: "3 kapselia päivittäin ruuan kanssa.",
    productColor: "#1a6b8a",
  },
]

export const products: Product[] = baseProducts

export function getAllProducts(locale: string = "fi"): Product[] {
  if (locale === "fi") return baseProducts
  return baseProducts.map((p) => {
    const t = productTranslations[p.slug]?.[locale as "sv" | "en"]
    if (!t) return p
    return { ...p, ...t }
  })
}

export function getProduct(slug: string, locale: string = "fi"): Product | undefined {
  const p = baseProducts.find((p) => p.slug === slug)
  if (!p) return undefined
  if (locale === "fi") return p
  const t = productTranslations[p.slug]?.[locale as "sv" | "en"]
  if (!t) return p
  return { ...p, ...t }
}

export function getFeaturedProducts(locale: string = "fi"): Product[] {
  const featured = [
    "biocell-kollageeni-hyaluronihappo",
    "quattro-magnesium",
    "omega-3-krillioljy",
    "lions-mane-sienikapseli",
  ]
  return featured.map((slug) => getProduct(slug, locale)).filter(Boolean) as Product[]
}

export function getRelatedProducts(slug: string, count: number = 4, locale: string = "fi"): Product[] {
  const current = getProduct(slug)
  if (!current) return []
  return getAllProducts(locale)
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, count)
}
