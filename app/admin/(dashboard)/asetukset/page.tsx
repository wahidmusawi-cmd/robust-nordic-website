import { CheckCircle2, ExternalLink, TriangleAlert } from "lucide-react"

// Env/config status must reflect the RUNNING server, never the build snapshot.
export const dynamic = "force-dynamic"

import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { isAdminConfigured } from "@/lib/admin/auth"
import { formatNumber } from "@/lib/admin/format"
import {
  isStripeConfigured,
  isTestMode,
  isWebhookConfigured,
  stripeDashboardUrl,
} from "@/lib/admin/stripe"
import { products } from "@/lib/products"

export const metadata = { title: "Asetukset" }

/** Placeholder values from .env.example (containing "...") count as unset. */
function isEnvSet(value: string | undefined): boolean {
  return Boolean(value && !value.includes("...") && value.trim().length > 0)
}

function EnvStatus({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
      <CheckCircle2 className="size-4" aria-hidden />
      Määritetty
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
      <TriangleAlert className="size-4" aria-hidden />
      Puuttuu
    </span>
  )
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  )
}

export default async function SettingsPage() {
  const stripeConfigured = isStripeConfigured()
  const webhookConfigured = isWebhookConfigured()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const baseUrlSet = isEnvSet(baseUrl)
  const adminPasswordSet = isAdminConfigured() && isEnvSet(process.env.ADMIN_PASSWORD)
  const sessionSecretSet = isEnvSet(process.env.ADMIN_SESSION_SECRET)

  const envRows: { name: string; set: boolean; description: string }[] = [
    {
      name: "STRIPE_SECRET_KEY",
      set: stripeConfigured,
      description: "Stripen salainen avain tilausten hakuun ja kassaan.",
    },
    {
      name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      set: isEnvSet(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      description: "Stripen julkinen avain selaimessa tapahtuvaa maksua varten.",
    },
    {
      name: "STRIPE_WEBHOOK_SECRET",
      set: webhookConfigured,
      description: "Webhook-allekirjoitusten tarkistusavain tilaustapahtumille.",
    },
    {
      name: "NEXT_PUBLIC_BASE_URL",
      set: baseUrlSet,
      description: "Sivuston julkinen osoite, jota kassa käyttää paluulinkeissä.",
    },
    {
      name: "ADMIN_PASSWORD",
      set: adminPasswordSet,
      description: "Hallintapaneelin kirjautumissalasana.",
    },
    {
      name: "ADMIN_SESSION_SECRET",
      set: sessionSecretSet,
      description: "Istuntoevästeen allekirjoitusavain (suositeltu erillinen arvo).",
    },
  ]

  return (
    <>
      <PageHeader title="Asetukset" description="Kaupan ja integraatioiden tila" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Kauppa</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <Row label="Nimi">
                <span className="font-medium">Robust Nordic</span>
              </Row>
              <Row label="Verkkokauppa">
                <a
                  href="https://robustnordic.fi"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline"
                >
                  robustnordic.fi
                </a>
              </Row>
              <Row label="Esikatselu">
                {baseUrlSet && baseUrl ? (
                  <a
                    href={baseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium break-all hover:underline"
                  >
                    {baseUrl}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Ei asetettu</span>
                )}
              </Row>
              <Row label="Kielet">
                <span className="flex items-center gap-1.5">
                  <Badge variant="secondary">FI</Badge>
                  <Badge variant="secondary">SV</Badge>
                  <Badge variant="secondary">EN</Badge>
                </span>
              </Row>
              <Row label="Tuotteita katalogissa">
                <span className="font-medium tabular-nums">{formatNumber(products.length)}</span>
              </Row>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Stripe-yhteys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="divide-y">
              <Row label="Secret key">
                <span className="flex items-center justify-end gap-2">
                  {stripeConfigured && (
                    <Badge variant="outline">{isTestMode() ? "Testitila" : "Live-tila"}</Badge>
                  )}
                  <EnvStatus ok={stripeConfigured} />
                </span>
              </Row>
              <Row label="Webhook">
                <EnvStatus ok={webhookConfigured} />
              </Row>
              <Row label="API-versio">
                <span className="font-mono text-xs">2025-02-24.acacia</span>
              </Row>
            </dl>
            {!stripeConfigured && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Stripe-avainta ei ole määritetty, joten hallinta näyttää demodataa. Lisää
                STRIPE_SECRET_KEY Vercelissä kohdassa Settings → Environment Variables ja
                julkaise sovellus uudelleen.
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="outline" asChild>
              <a href={stripeDashboardUrl()} target="_blank" rel="noreferrer">
                Avaa Stripe Dashboard
                <ExternalLink aria-hidden />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Hallinnan suojaus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="divide-y">
              <Row label={<span className="font-mono text-xs">ADMIN_PASSWORD</span>}>
                <EnvStatus ok={adminPasswordSet} />
              </Row>
              <Row
                label={
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">ADMIN_SESSION_SECRET</span>
                    <span className="text-muted-foreground text-xs">(suositeltu)</span>
                  </span>
                }
              >
                <EnvStatus ok={sessionSecretSet} />
              </Row>
              <Row label="Istunnon kesto">
                <span className="font-medium">7 päivää</span>
              </Row>
            </dl>
            {!adminPasswordSet && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Ilman salasanaa hallinta on avoin kehitystilassa ja lukittu tuotannossa.
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Salasana vaihdetaan päivittämällä ympäristömuuttuja ja julkaisemalla sovellus
              uudelleen.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Kassan asetukset</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <Row label="Toimitusmaat">
                <span className="flex flex-wrap items-center justify-end gap-1.5">
                  {["FI", "SE", "EE", "DE", "DK", "NO"].map((code) => (
                    <Badge key={code} variant="secondary">
                      {code}
                    </Badge>
                  ))}
                </span>
              </Row>
              <Row label="Maksutavat">
                <span className="font-medium">Kortti (Stripe Checkout)</span>
              </Row>
              <Row label="Alennuskoodit">
                <span className="font-medium">Käytössä</span>
              </Row>
              <Row label="Onnistumissivu">
                <span className="font-mono text-xs">/tilaus/kiitos</span>
              </Row>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Ympäristömuuttujat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Muuttuja</TableHead>
                <TableHead>Tila</TableHead>
                <TableHead>Kuvaus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {envRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-mono text-xs">{row.name}</TableCell>
                  <TableCell>
                    <EnvStatus ok={row.set} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
