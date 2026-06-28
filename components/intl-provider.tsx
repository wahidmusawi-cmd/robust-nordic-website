"use client"

import { NextIntlClientProvider } from "next-intl"
import type { ReactNode } from "react"

export function IntlProvider({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider
      onError={() => {}}
      getMessageFallback={() => ""}
    >
      {children}
    </NextIntlClientProvider>
  )
}
