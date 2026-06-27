// The root layout is intentionally a pass-through. The real <html>/<body>
// markup lives in app/[locale]/layout.tsx so the lang attribute can be
// locale-aware (see next-intl App Router setup).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
