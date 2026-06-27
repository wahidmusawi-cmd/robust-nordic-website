import { useTranslations } from "next-intl"
import { Instagram, Facebook, Linkedin, Mail, Phone, Clock } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Logo } from "@/components/logo"

const productLinks = [
  { label: "Kaikki tuotteet", labelKey: "allProducts", href: "/tuotteet" },
  { label: "BioCell Kollageeni®", href: "/tuotteet/biocell-kollageeni-hyaluronihappo" },
  { label: "Quattro Magnesium", href: "/tuotteet/quattro-magnesium" },
  { label: "Omega-3 Krilliöljy", href: "/tuotteet/omega-3-krillioljy" },
  { label: "Biotic Boost", href: "/tuotteet/biotic-boost-probiootti" },
]

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  const t = useTranslations("footer")

  const infoLinks = [
    { label: t("about"), href: "/meista" },
    { label: t("quality"), href: "/laatu-ja-luottamus" },
    { label: t("blog"), href: "/blogi" },
    { label: t("sponsors"), href: "/sponsoritarinat" },
    { label: t("contact"), href: "/yhteystiedot" },
  ]

  const supportLinks = [
    { label: t("faq"), href: "/ukk" },
    { label: t("shipping"), href: "/toimitusehdot" },
    { label: t("payments"), href: "/maksutavat" },
    { label: t("privacy"), href: "/tietosuoja" },
    { label: t("terms"), href: "/kopvillkor" },
  ]

  return (
    <footer id="yhteystiedot" className="bg-foreground text-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="mb-6">
              <Logo variant="white" />
            </div>
            <p className="text-sm text-background/60 leading-relaxed mb-6">{t("tagline")}</p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4">{t("headingProducts")}</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4">{t("headingInfo")}</h4>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4">{t("headingSupport")}</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4">{t("headingContact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-background/40" />
                <a
                  href="mailto:asiakaspalvelu@robustnordic.fi"
                  className="text-sm text-background/60 hover:text-background transition-colors break-all"
                >
                  asiakaspalvelu@robustnordic.fi
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-background/40" />
                <a href="tel:+358503720007" className="text-sm text-background/60 hover:text-background transition-colors">
                  050 372 0007
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-background/40" />
                <span className="text-sm text-background/60">{t("hours")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} Robust Nordic. {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-background/40">{t("madeIn")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
