// Ruotsin- ja englanninkieliset otsikot ja kuvaukset blogeille ja sponsoritarinoille.
// body on valinnainen – jos sitä ei ole, käytetään suomenkielistä leipätekstiä.
// Huom: sv/en-teksteissä vältetään "Suomi/suomalainen" -> "nordisk/Nordic".

export type ContentBlock = { t: "h2" | "h3" | "p" | "li"; c: string }

export type LocalizedArticle = {
  title: string
  desc: string
  body?: ContentBlock[]
}

export type LocalizedMeta = {
  sv: LocalizedArticle
  en: LocalizedArticle
}

export const blogMetaI18n: Record<string, LocalizedMeta> = {
  "aivojen-ystava-ja-immuunijarjestelman-vahvistaja-tutustu-lions-mane-sienen-uskomattomiin-terveyshyotyihin": {
    sv: {
      title: "Hjärnans vän och immunförsvarets förstärkare: lär känna Lion's Mane",
      desc: "Upptäck naturens under: Lion's Mane (Hericium erinaceus) är en svamp som blivit allt populärare för sina hälsofördelar för minne, koncentration och immunförsvar.",
    },
    en: {
      title: "Friend of the brain and immune booster: meet Lion's Mane",
      desc: "Discover a wonder of nature: Lion's Mane (Hericium erinaceus) is a mushroom growing in popularity for its benefits to memory, focus and the immune system.",
    },
  },
  "reishi-sieni-itamainen-laakesieni-nykyaikaisen-hyvinvoinnin-tukena": {
    sv: {
      title: "Reishi – en österländsk medicinsvamp till stöd för modernt välmående",
      desc: "Reishi, även kallad Lingzhi eller Ganoderma lucidum, har använts i tusentals år i österländsk medicin. Idag står 'odödlighetens svamp' i centrum för modern välmåendekultur.",
    },
    en: {
      title: "Reishi – an Eastern medicinal mushroom for modern wellbeing",
      desc: "Reishi, also known as Lingzhi or Ganoderma lucidum, has been central to Eastern medicine for thousands of years. Today the 'mushroom of immortality' is a wellness favourite.",
    },
  },
  "chaga-sieni-luonnon-oma-superruoka": {
    sv: {
      title: "Chaga – naturens egen supermat",
      desc: "Chaga, även kallad sprängticka, har fått mycket uppmärksamhet för sina hälsofördelar. Den är en av naturens rikaste källor till antioxidanter.",
    },
    en: {
      title: "Chaga – nature's own superfood",
      desc: "Chaga has drawn a lot of attention for its health benefits and is one of nature's richest sources of antioxidants.",
    },
  },
  "elokuu-ja-vitamiinivinkit": {
    sv: {
      title: "Augusti och vitamintips",
      desc: "Augusti markerar sommarens höjdpunkt och övergången mot hösten. Så här säkrar du kroppens välmående när dagsljuset minskar och temperaturen sjunker.",
    },
    en: {
      title: "August and vitamin tips",
      desc: "August marks the peak of summer and the shift toward autumn. Here's how to support your body's wellbeing as daylight fades and temperatures drop.",
    },
  },
  "iltarutiini-avain-levolliseen-uneen": {
    sv: {
      title: "Kvällsrutin – nyckeln till en vilsam sömn",
      desc: "I dagens hektiska värld är god sömn en värdefull resurs. En lugnande och konsekvent kvällsrutin är ett av de mest effektiva sätten att förbättra sömnkvaliteten.",
    },
    en: {
      title: "Evening routine – the key to restful sleep",
      desc: "In today's busy world, good sleep is a precious resource. A calming, consistent evening routine is one of the most effective ways to improve sleep quality.",
    },
  },
  "omega-3-krillioljy-kevaan-tehokas-tukija-hyvinvoinnille": {
    sv: {
      title: "Omega-3 Krillolja – vårens effektiva stöd för välmående",
      desc: "Våren är en tid för förnyelse – i naturen och i kroppen. Då blir omega-3-fettsyror, och särskilt krillolja, ovärderliga för att återställa energi och ork.",
    },
    en: {
      title: "Omega-3 Krill Oil – an effective spring support for wellbeing",
      desc: "Spring is a time of renewal – in nature and in the body. That's when omega-3 fatty acids, and krill oil in particular, become invaluable for restoring energy.",
    },
  },
  "quattro-magnesium-neljan-muodon-teho-yhdessa-kapselissa": {
    sv: {
      title: "Quattro Magnesium – fyra formers kraft i en kapsel",
      desc: "Magnesium är ett av de viktigaste mineralerna för kroppen, men många får i sig för lite. Robust Nordic svarar på behovet med högkvalitativa Quattro Magnesium.",
    },
    en: {
      title: "Quattro Magnesium – the power of four forms in one capsule",
      desc: "Magnesium is one of the body's most important minerals, yet many people get too little. Robust Nordic answers that need with high-quality Quattro Magnesium.",
    },
  },
  "elokuu-uusi-alku-ihon-ja-nivelten-hyvinvoinnille": {
    sv: {
      title: "Augusti – en ny start för hud och leder",
      desc: "Dags att stärka huden och lederna inifrån. Kollagen är ett protein som naturligt finns i kroppen och håller vävnaderna elastiska och starka.",
    },
    en: {
      title: "August – a fresh start for skin and joints",
      desc: "Time to strengthen skin and joints from within. Collagen is a protein naturally found in the body that keeps tissues elastic and strong.",
    },
  },
  "hyodynna-b12-n-taysi-teho-folaatti-tekee-sen-mahdolliseksi": {
    sv: {
      title: "Utnyttja B12:s fulla effekt – folat gör det möjligt",
      desc: "Många vet att vitamin B12 är viktigt för nervsystem, minne och energi. Men utan tillräckligt med folat kan B12 inte fungera fullt ut i kroppen.",
    },
    en: {
      title: "Unlock B12's full power – folate makes it possible",
      desc: "Many know vitamin B12 matters for the nervous system, memory and energy. But without enough folate, B12 can't work fully in your body.",
    },
  },
  "hiljaisempi-ilta-ei-aina-tarkoita-palautumista": {
    sv: {
      title: "En lugnare kväll betyder inte alltid återhämtning",
      desc: "Att varva ner på kvällen är inte samma sak som verklig återhämtning. Så här stöder du kroppens återhämtning på riktigt – inte bara på ytan.",
    },
    en: {
      title: "A quieter evening doesn't always mean recovery",
      desc: "Slowing down in the evening isn't the same as real recovery. Here's how to genuinely support your body's recovery – not just on the surface.",
    },
  },
  "kesa-aurinko-ja-hyvinvointi-miksi-vitamiineista-kannattaa-huolehtia-myos-kesalla": {
    sv: {
      title: "Sommar, sol och välmående – varför vitaminer är viktiga även på sommaren",
      desc: "Sommaren betyder sol och ledighet, men det är värt att sköta om vitaminerna även nu. Så här håller du kroppen i balans under den ljusa årstiden.",
    },
    en: {
      title: "Summer, sun and wellbeing – why vitamins matter in summer too",
      desc: "Summer means sun and time off, but it's still worth looking after your vitamins. Here's how to keep your body balanced during the bright season.",
    },
  },
}

export const sponsorMetaI18n: Record<string, LocalizedMeta> = {
  "aitajuoksija-mila-heikkonen": {
    sv: { title: "Häcklöparen Mila Heikkonen", desc: "Möt häcklöparen Mila Heikkonen, en av de nordiska idrottare som Robust Nordic stöder på vägen mot toppen." },
    en: { title: "Hurdler Mila Heikkonen", desc: "Meet hurdler Mila Heikkonen, one of the Nordic athletes Robust Nordic supports on the road to the top." },
  },
  "painija-tino-ojala": {
    sv: { title: "Brottaren Tino Ojala", desc: "Brottaren Tino Ojala berättar om träning, återhämtning och hur Robust Nordic stöder hans vardag som idrottare." },
    en: { title: "Wrestler Tino Ojala", desc: "Wrestler Tino Ojala talks about training, recovery and how Robust Nordic supports his everyday life as an athlete." },
  },
  "painiseura-helsingin-haka": {
    sv: { title: "Brottarklubben Helsingin Haka", desc: "Robust Nordic stöder brottarklubben Helsingin Haka och dess unga idrottare på deras väg framåt." },
    en: { title: "Wrestling club Helsingin Haka", desc: "Robust Nordic supports the wrestling club Helsingin Haka and its young athletes on their journey forward." },
  },
  "ammattinyrkkeilija-ilari-kujala": {
    sv: { title: "Proffsboxaren Ilari Kujala", desc: "Proffsboxaren Ilari Kujala berättar om sin väg, sina mål och samarbetet med Robust Nordic." },
    en: { title: "Professional boxer Ilari Kujala", desc: "Professional boxer Ilari Kujala shares his journey, his goals and his partnership with Robust Nordic." },
  },
  "mma-ammattilainen-omar-tugarev": {
    sv: { title: "MMA-proffset Omar Tugarev", desc: "MMA-proffset Omar Tugarev berättar om träning på elitnivå och hur tillskott stöder hans prestation." },
    en: { title: "MMA professional Omar Tugarev", desc: "MMA professional Omar Tugarev talks about elite-level training and how supplements support his performance." },
  },
}
