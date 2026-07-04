import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Info, TriangleAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/admin/login-form"
import { isAdminConfigured } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Kirjaudu sisään",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ seuraava?: string; ulos?: string }>
}) {
  const params = await searchParams
  const nextPath = params.seuraava ?? "/admin"
  const configured = isAdminConfigured()
  const isDev = process.env.NODE_ENV !== "production"

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.14em] uppercase">Robust Nordic</p>
          <p className="text-muted-foreground text-sm">Hallintapaneeli</p>
        </div>

        {params.ulos && (
          <div className="border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            Olet kirjautunut ulos.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Kirjaudu sisään</CardTitle>
            <CardDescription>Syötä ylläpitäjän salasana jatkaaksesi.</CardDescription>
          </CardHeader>
          <CardContent>
            {configured ? (
              <LoginForm nextPath={nextPath} />
            ) : (
              <div className="space-y-3 text-sm">
                <div className="border-amber-200 bg-amber-50 text-amber-900 flex items-start gap-2 rounded-lg border px-3 py-2.5">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p>
                    Salasanaa ei ole vielä määritetty. Lisää ympäristömuuttuja ja käynnistä
                    palvelin uudelleen:
                  </p>
                </div>
                <pre className="bg-muted overflow-x-auto rounded-md px-3 py-2 text-xs">
                  <code>ADMIN_PASSWORD=vahva-salasana</code>
                </pre>
                {isDev && (
                  <div className="text-muted-foreground flex items-start gap-2">
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <p>
                      Kehitystilassa kirjautuminen ohitetaan —{" "}
                      <Link href="/admin" className="text-primary underline underline-offset-2">
                        siirry hallintaan
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-center text-xs">
          <a href="/fi" className="hover:text-foreground transition-colors">
            ← Takaisin kauppaan
          </a>
        </p>
      </div>
    </main>
  )
}
