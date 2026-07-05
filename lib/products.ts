import { productTranslations } from "@/lib/product-translations"

export type Product = {
  slug: string
  name: string
  shortName: string
  size?: string
  price: string
  stripePriceId?: string
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

// Kaikki tuotteet haettu robustnordic.fi -kaupasta (oikeat kuvat, hinnat ja kuvaukset)
export const products: Product[] = [
  {
    slug: "biocell-kollageeni-hyaluronihappo",
    name: "BioCell Kollageeni® + Hyaluronihappo",
    shortName: "BioCell Kollageeni®",
    size: "60 kaps.",
    price: "36,90",
    stripePriceId: "price_1Tpmj3HoGJuna68gqX6s0qHZ",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/kollageeni.png?v=1767721990",
    category: "ravintolisat",
    tagline: "Iholle & nivelille",
    description:
      "Patentoitu BioCell Collagen® yhdistettynä hyaluronihappoon tukee ihon kimmoisuutta, nivelten liikkuvuutta ja rustokudoksen hyvinvointia. Kliinisesti tutkittu koostumus, joka imeytyy tehokkaasti.",
    benefits: [
      "Tukee ihon, hiusten ja kynsien terveyttä",
      "Edistää nivelten liikkuvuutta ja rustokudosta",
      "Patentoitu BioCell Collagen® -raaka-aine",
      "Sisältää hyaluronihappoa ja kondroitiinia",
    ],
    usage: "2 kapselia päivässä veden kanssa, mieluiten tyhjään vatsaan.",
    badge: "Suosittu",
    productColor: "#e8c4cb",
  },
  {
    slug: "quattro-magnesium",
    name: "Quattro Magnesium",
    shortName: "Quattro Magnesium",
    size: "60 kaps.",
    price: "36,90",
    stripePriceId: "price_1Tpmj4HoGJuna68g69lVTnKP",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/quattro-magnesium.png?v=1767722068",
    category: "ravintolisat",
    tagline: "Lihaksille, luustolle & hermostolle",
    description:
      "Neljä erilaista hyvin imeytyvää magnesiummuotoa yhdessä kapselissa: glysinaatti, sitraatti, malaatti ja tauraatti. Täydennettynä bioaktiivisella B6-vitamiinilla lihasten, hermoston ja energia-aineenvaihdunnan tueksi.",
    benefits: [
      "Tukee lihasten normaalia toimintaa ja rentoutumista",
      "Edistää hermoston ja psyykkisten toimintojen toimintaa",
      "Vähentää väsymystä ja uupumusta",
      "Neljä magnesiummuotoa + bioaktiivinen B6",
    ],
    usage: "2 kapselia päivässä, mieluiten illalla veden kanssa.",
    badge: "Suosittu",
    productColor: "#6590b2",
  },
  {
    slug: "omega-3-krillioljy",
    name: "Omega-3 Krilliöljy",
    shortName: "Omega-3 Krilliöljy",
    size: "60 kaps.",
    price: "39,90",
    stripePriceId: "price_1Tpmj6HoGJuna68gPfQWkysj",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/krillioljy-omega.png?v=1767722033",
    category: "ravintolisat",
    tagline: "Aivoille, sydämelle & maksalle",
    description:
      "Luonnostaan fosfolipidimuodossa olevat Omega-3-rasvahapot (EPA ja DHA) tukevat sydämen, aivojen ja maksan hyvinvointia tehokkaasti. Sisältää Superba2™ -krilliöljyä ja astaksantiinia, joka imeytyy paremmin kuin tavallinen kalaöljy.",
    benefits: [
      "Tukee sydämen normaalia toimintaa",
      "Edistää aivojen ja näön normaalia toimintaa",
      "Sisältää astaksantiinia – voimakasta antioksidanttia",
      "Superba2™ – erinomainen imeytyvyys",
    ],
    usage: "2 kapselia päivässä ruokailun yhteydessä.",
    productColor: "#c44a4a",
  },
  {
    slug: "reishi-chaga-lions-mane",
    name: "Reishi, Chaga, Lion's Mane",
    shortName: "Reishi, Chaga, Lion's Mane",
    size: "60 kaps.",
    price: "36,90",
    stripePriceId: "price_1Tpmj7HoGJuna68g8fXWTZAY",
    image:
      "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Sienettuotekuva_79da6894-d8c9-402f-8599-a60e35aa2c21.png?v=1764063319",
    category: "ravintolisat",
    tagline: "Vastustuskyvyn & jaksamisen tueksi",
    description:
      "Kolme tehokasta adaptogeenisientä yhdessä: Reishi tukee stressinhallintaa, Chaga on runsas antioksidanttien lähde ja Lion's Mane tukee muistia ja keskittymistä.",
    benefits: [
      "Reishi – stressinhallinta ja palautuminen",
      "Chaga – runsaasti antioksidantteja",
      "Lion's Mane – muisti ja keskittyminen",
      "Kolme adaptogeenisientä yhdessä kapselissa",
    ],
    usage: "2 kapselia päivässä veden kanssa.",
    productColor: "#8a6d3b",
  },
  {
    slug: "biotic-boost-probiootti",
    name: "Biotic Boost (Probiootti)",
    shortName: "Biotic Boost",
    size: "60 kaps.",
    price: "41,90",
    stripePriceId: "price_1Tpmj8HoGJuna68g43oX1dKH",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/BioticBoostproductpic.png?v=1765455204",
    category: "ravintolisat",
    tagline: "Suolistolle & immuniteetille",
    description:
      "Sisältää 16 erilaista bakteerikantaa sekä prebiootteja, jotka tukevat ruoansulatusta, suoliston hyvinvointia, immuunijärjestelmää ja mielen tasapainoa.",
    benefits: [
      "16 erilaista bakteerikantaa",
      "Sisältää prebiootteja bakteerien ravinnoksi",
      "Tukee ruoansulatusta ja suoliston hyvinvointia",
      "Edistää immuunijärjestelmän toimintaa",
    ],
    usage: "1 kapseli päivässä, mieluiten aamulla tyhjään vatsaan.",
    productColor: "#5a8f6b",
  },
  {
    slug: "c-vitamiini-pureway-c-sinkki",
    name: "C-vitamiini Pureway-C® + Sinkki",
    shortName: "C-vitamiini + Sinkki",
    size: "60 kaps.",
    price: "36,90",
    stripePriceId: "price_1Tpmj9HoGJuna68g6phrl5QR",
    image:
      "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Cvitamiinituotekuva_75a69245-3ed2-4e52-9567-475730b2ed04.png?v=1764062650",
    category: "ravintolisat",
    tagline: "Vastustuskyvylle",
    description:
      "Robustin laadukas PUREWAY-C® on tehokkaasti imeytyvä ja pitkävaikutteinen C-vitamiinin muoto. Yhdistettynä sinkkiin se tukee immuunijärjestelmän normaalia toimintaa.",
    benefits: [
      "PUREWAY-C® – imeytyy nopeammin kuin tavallinen C-vitamiini",
      "Pitkävaikutteinen koostumus",
      "Sinkki tukee immuunijärjestelmää",
      "Suojaa soluja oksidatiiviselta stressiltä",
    ],
    usage: "1 kapseli päivässä veden kanssa.",
    productColor: "#e0913b",
  },
  {
    slug: "zma-magnesiumglysinaatti",
    name: "ZMA – Magnesiumglysinaatti",
    shortName: "ZMA",
    size: "120 kaps.",
    price: "35,90",
    stripePriceId: "price_1TpmjAHoGJuna68guY5FEYCx",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/ZMAproductpic.png?v=1765373403",
    category: "ravintolisat",
    tagline: "Palautumiseen & hormonitasapainoon",
    description:
      "ZMA sisältää magnesiumglysinaattia, B6-vitamiinia, sinkkiä ja hampunsiemenproteiinia – tukee unta, hormonitoimintaa ja lihasten palautumista. Klassikoiden klassikko urheilijoille.",
    benefits: [
      "Tukee lihasten palautumista",
      "Edistää normaalia hormonitoimintaa",
      "Magnesium ja B6 tukevat unta",
      "Sinkki ylläpitää normaalia testosteronitasoa",
    ],
    usage: "3 kapselia päivässä ennen nukkumaanmenoa, tyhjään vatsaan.",
    productColor: "#4a6b8a",
  },
  {
    slug: "moringa-luonnon-multivitamiini",
    name: "Moringa (luonnon multivitamiini)",
    shortName: "Moringa",
    size: "60 kaps.",
    price: "39,90",
    stripePriceId: "price_1TpmjCHoGJuna68gXIm3FOYY",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Moringaproductpic.png?v=1765456961",
    category: "ravintolisat",
    tagline: "Energiaa & vastustuskykyä",
    description:
      "Luomu-moringa on luonnollinen kasvilähde A- ja E-vitamiinille sekä raudalle, jotka tukevat normaalia energiantuotantoa, immuunijärjestelmän toimintaa ja auttavat vähentämään väsymystä.",
    benefits: [
      "Superfood täynnä vitamiineja ja mineraaleja",
      "Tukee energiantuotantoa",
      "Sisältää rautaa ja A- sekä E-vitamiinia",
      "Auttaa vähentämään väsymystä",
    ],
    usage: "2 kapselia päivässä veden kanssa.",
    productColor: "#5a8f4a",
  },
  {
    slug: "b12-vitamiini-folaatti",
    name: "B12-vitamiini + Folaatti",
    shortName: "B12 + Folaatti",
    size: "120 tbl.",
    price: "39,90",
    stripePriceId: "price_1TpmjDHoGJuna68gArLsI5KM",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/b12.png?v=1767721905",
    category: "ravintolisat",
    tagline: "Hermostolle & muistille",
    description:
      "Metyloitu B12 (metyylikobalamiini) yhdistettynä aktiiviseen folaattiin hermoston ja muistin tueksi. Sisältää suomalaista villimustikkaa.",
    benefits: [
      "Tukee hermoston normaalia toimintaa",
      "Edistää punasolujen muodostumista",
      "Aktiivinen, hyvin imeytyvä B12-muoto",
      "Sisältää suomalaista villimustikkaa",
    ],
    usage: "1 tabletti päivässä.",
    productColor: "#7a2d4a",
  },
  {
    slug: "bone-boost-kalsium-d3-k2",
    name: "Bone Boost – Kalsium + D3 + K2",
    shortName: "Bone Boost",
    size: "60 kaps.",
    price: "26,90",
    stripePriceId: "price_1TpmjEHoGJuna68g51hQZoO9",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/BoneBoostproductpic.png?v=1765373691",
    category: "ravintolisat",
    tagline: "Luustolle & hampaille",
    description:
      "Luonnollinen yhdistelmä D₃- ja K₂-vitamiinia kalsiumilla vahvistaa luustoa ja hampaita sekä tukee kehon normaalia verenkiertoa. D3 ja K2 ohjaavat kalsiumin oikeaan paikkaan.",
    benefits: [
      "Vahvistaa luustoa ja hampaita",
      "D3 tukee kalsiumin imeytymistä",
      "K2 ohjaa kalsiumin luihin",
      "Tukee normaalia verenkiertoa",
    ],
    usage: "2 kapselia päivässä ruokailun yhteydessä.",
    productColor: "#6b8a9c",
  },
  {
    slug: "kelp-luonnollinen-jodi",
    name: "Kelp (Luonnollinen jodi)",
    shortName: "Kelp – Jodi",
    size: "90 kaps.",
    price: "29,90",
    stripePriceId: "price_1TpmjFHoGJuna68gHzCKISkz",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Kelpproductpic.png?v=1765456057",
    category: "ravintolisat",
    tagline: "Kilpirauhaselle & aineenvaihdunnalle",
    description:
      "Pohjoisnorjalaisesta merilevästä valmistettu kelp on luonnollinen jodilähde aineenvaihdunnan, hormonitasapainon ja energiantuotannon tueksi. Runsaasti mineraaleja ja antioksidantteja.",
    benefits: [
      "Luonnollinen jodin lähde merilevästä",
      "Tukee kilpirauhasen normaalia toimintaa",
      "Edistää energia-aineenvaihduntaa",
      "Runsaasti mineraaleja",
    ],
    usage: "1 kapseli päivässä veden kanssa.",
    productColor: "#3b6b5a",
  },
  {
    slug: "arctic-menoboost",
    name: "Arctic Menoboost",
    shortName: "Arctic Menoboost",
    size: "60 kaps.",
    price: "35,90",
    stripePriceId: "price_1TpmjHHoGJuna68gckUXPqsi",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Menoboostproductpic_1.png?v=1765372383",
    category: "ravintolisat",
    tagline: "Tasapainoa vaihdevuosiin",
    description:
      "Luonnollinen tuki vaihdevuosien ajalle. Arctic MenoBoost yhdistää huolella valitut kasviuutteet ja B-vitamiinit, jotka auttavat ylläpitämään tasapainoa, jaksamista ja levollista oloa.",
    benefits: [
      "Luonnolliset kasviuutteet vaihdevuosien tueksi",
      "Tukee jaksamista ja tasapainoa",
      "B-vitamiinit edistävät hermoston toimintaa",
      "Auttaa ylläpitämään levollista oloa",
    ],
    usage: "2 kapselia päivässä veden kanssa.",
    productColor: "#9c6b8a",
  },
  {
    slug: "amin-x-robust-eaa",
    name: "Amin X Robust EAA-jauhe",
    shortName: "Amin X EAA",
    price: "34,90",
    stripePriceId: "price_1TpmjIHoGJuna68gxzkt2B8q",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Mockup-1_1.png?v=1766217693",
    category: "ravintolisat",
    tagline: "Lihasten palautumiseen",
    description:
      "Laadukas EAA- ja BCAA-yhdistelmä aktiivisille liikkujille. Sisältää kaikki välttämättömät aminohapot (EAA) sekä BCAA-aminohapot optimaalisessa 2:1:1-suhteessa lihasten palautumisen ja kehon suorituskyvyn tueksi.",
    benefits: [
      "Kaikki välttämättömät aminohapot (EAA)",
      "BCAA 2:1:1-suhteessa",
      "Tukee lihasten palautumista ja kasvua",
      "Ihanteellinen harjoittelun aikana ja jälkeen",
    ],
    usage: "1 annos (mittalusikka) veteen sekoitettuna harjoittelun yhteydessä.",
    productColor: "#4a7a8a",
  },
  {
    slug: "grape-punch-elektrolyytti",
    name: "Grape Punch – Elektrolyyttijuoma",
    shortName: "Grape Punch",
    price: "39,90",
    stripePriceId: "price_1TpmjJHoGJuna68gQO31obiV",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Grapepunchproductpicture_1.png?v=1765977042",
    category: "ravintolisat",
    tagline: "Nesteytykseen & energiaan",
    description:
      "Grape Punch -elektrolyyttijuoma tarjoaa tehokkaan nesteytyksen, tärkeät mineraalit sekä raikkaan maun täysin ilman sokeria, kaloreita tai kofeiinia. Suunniteltu urheilijoille ja aktiiviseen elämäntapaan.",
    benefits: [
      "Tehokas nesteytys ja elektrolyytit",
      "Ei sokeria, kaloreita tai kofeiinia",
      "Raikas rypäleen maku",
      "Urheilijoille ja aktiiviseen arkeen",
    ],
    usage: "1 annos veteen sekoitettuna tarpeen mukaan.",
    badge: "Uutuus",
    productColor: "#6b4a8a",
  },
  {
    slug: "airflow-nenateippi",
    name: "AirFlow Nenäteippi",
    shortName: "AirFlow Nenäteippi",
    price: "29,90",
    stripePriceId: "price_1TpmjLHoGJuna68gFbcherH1",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Nenateippikuva.png?v=1766066300",
    category: "hyvinvointi",
    tagline: "Parempaan hengitykseen & uneen",
    description:
      "Nopeavaikutteinen nenäteippi lievittää nenän tukkoisuutta ja vähentää kuorsaamista. Parantaa urheilusuoritusta ja unen laatua avaamalla hengitystiet luonnollisesti.",
    benefits: [
      "Lievittää nenän tukkoisuutta",
      "Vähentää kuorsaamista",
      "Parantaa urheilusuoritusta",
      "Edistää parempaa unta",
    ],
    usage: "Kiinnitä puhtaalle ja kuivalle iholle nenän päälle ennen nukkumista tai urheilua.",
    productColor: "#4a6b8a",
  },
  {
    slug: "migreenimyssy",
    name: "Migreenimyssy",
    shortName: "Migreenimyssy",
    price: "39,90",
    stripePriceId: "price_1TpmjMHoGJuna68gJy3X74ua",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Migreenimyssykuva.png?v=1766066159",
    category: "hyvinvointi",
    tagline: "Helpotusta migreeniin & stressiin",
    description:
      "Tehokasta helpotusta migreeniin, päänsärkyyn, stressiin ja lihasjäykkyyteen. Kylmä- ja painekäsittely rentouttaa ja rauhoittaa luonnollisesti ilman lääkkeitä.",
    benefits: [
      "Helpottaa migreeniä ja päänsärkyä",
      "Rentouttaa ja vähentää stressiä",
      "Lievittää lihasjäykkyyttä",
      "Uudelleenkäytettävä ja helppokäyttöinen",
    ],
    usage: "Säilytä pakastimessa ja aseta päähän 15–20 minuutiksi tarpeen mukaan.",
    productColor: "#4a5a8a",
  },
  {
    slug: "pilleriannostelija",
    name: "Pilleriannostelija",
    shortName: "Pilleriannostelija",
    price: "14,90",
    stripePriceId: "price_1TpmjNHoGJuna68gm1KdfT9N",
    image: "https://cdn.shopify.com/s/files/1/0852/3631/8539/files/Robustpilleriannostelija.png?v=1766219097",
    category: "hyvinvointi",
    tagline: "Päivittäisten lisien annosteluun",
    description:
      "Kätevä Robust Nordic -pilleriannostelija auttaa pitämään päivittäiset ravintolisät järjestyksessä ja mukana matkalla. Selkeä ja kestävä muotoilu.",
    benefits: [
      "Pidä ravintolisät järjestyksessä",
      "Kätevä mukaan matkalle",
      "Kestävä ja laadukas materiaali",
      "Selkeä Robust Nordic -muotoilu",
    ],
    productColor: "#6590b2",
  },
]

// Slug -> live-kaupan handle ostolinkkejä varten
const liveHandles: Record<string, string> = {
  "biocell-kollageeni-hyaluronihappo": "biocell-kollageeni®-hyaluronihappo",
  "quattro-magnesium": "quattro-magnesium",
  "omega-3-krillioljy": "omega-3-krillioljy",
  "reishi-chaga-lions-mane": "reishi-chaga-lions-mane",
  "biotic-boost-probiootti": "biotic-boost-probiootti",
  "c-vitamiini-pureway-c-sinkki": "c-vitamiini-pureway-c®-sinkki",
  "zma-magnesiumglysinaatti": "magnesiumglysinaatti",
  "moringa-luonnon-multivitamiini": "moringa-luonnon-multivitamiini",
  "b12-vitamiini-folaatti": "b12-vitamiini-folaatti",
  "bone-boost-kalsium-d3-k2": "bone-boost-kalsium-d3-k2",
  "kelp-luonnollinen-jodi": "kelp-luonnollinen-jodi",
  "arctic-menoboost": "arctic-menoboost",
  "amin-x-robust-eaa": "amin-x-robust-eaa",
  "grape-punch-elektrolyytti": "ice-grape-12pack",
  "airflow-nenateippi": "airflow-nenateippi",
  "migreenimyssy": "migreenimyssy-1",
  "pilleriannostelija": "pilleriannostelija",
}

export function getBuyUrl(slug: string): string {
  const handle = liveHandles[slug]
  return handle ? `https://robustnordic.fi/products/${handle}` : "https://robustnordic.fi/collections/kaikki-tuotteet"
}

function localizeProduct(product: Product, locale?: string): Product {
  if (!locale || locale === "fi") return product
  const translations = productTranslations[product.slug]
  if (!translations) return product
  const copy = translations[locale as "sv" | "en"]
  if (!copy) return product
  return {
    ...product,
    name: copy.name ?? product.name,
    shortName: copy.shortName ?? product.shortName,
    tagline: copy.tagline ?? product.tagline,
    description: copy.description ?? product.description,
    benefits: copy.benefits ?? product.benefits,
    usage: copy.usage ?? product.usage,
  }
}

export function getProduct(slug: string, locale?: string): Product | undefined {
  const product = products.find((p) => p.slug === slug)
  return product ? localizeProduct(product, locale) : undefined
}

export function getRelatedProducts(slug: string, count = 4, locale?: string): Product[] {
  const current = products.find((p) => p.slug === slug)
  return products
    .filter((p) => p.slug !== slug && p.category === current?.category)
    .slice(0, count)
    .map((p) => localizeProduct(p, locale))
}

export function getAllProducts(locale?: string): Product[] {
  return products.map((p) => localizeProduct(p, locale))
}

// Etusivun esikatselu – neljä nostotuotetta
export const featuredSlugs = [
  "biocell-kollageeni-hyaluronihappo",
  "quattro-magnesium",
  "omega-3-krillioljy",
  "reishi-chaga-lions-mane",
]

export function getFeaturedProducts(locale?: string): Product[] {
  return featuredSlugs.map((s) => getProduct(s, locale)).filter(Boolean) as Product[]
}
