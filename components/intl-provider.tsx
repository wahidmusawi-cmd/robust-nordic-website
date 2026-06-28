"use client"

import { NextIntlClientProvider } from "next-intl"
import type { AbstractIntlMessages } from "next-intl"
import type { ReactNode } from "react"

interface Props {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
}

export function IntlProvider({ messages, locale, children }: Props) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      onError={() => {}}
      getMessageFallback={() => ""}
    >
      {children}
    </NextIntlClientProvider>
  )
}
