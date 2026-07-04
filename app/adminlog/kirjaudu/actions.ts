"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  getAdminSecret,
  isAdminConfigured,
  safePasswordCompare,
} from "@/lib/admin/auth"

export type LoginState = { error: string | null }

/** Only allow redirects back into the admin — never to arbitrary URLs. */
function safeNextPath(raw: string): string {
  return raw.startsWith("/adminlog") && !raw.startsWith("//") ? raw : "/adminlog"
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("salasana") ?? "")
  const nextPath = safeNextPath(String(formData.get("seuraava") ?? "/adminlog"))

  if (!isAdminConfigured()) {
    return { error: "Ylläpitäjän salasanaa (ADMIN_PASSWORD) ei ole määritetty palvelimella." }
  }
  if (!password) {
    return { error: "Anna salasana." }
  }

  const ok = await safePasswordCompare(password, process.env.ADMIN_PASSWORD!)
  if (!ok) {
    // Small fixed delay to slow down brute-force attempts.
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { error: "Väärä salasana." }
  }

  const token = await createSessionToken(getAdminSecret()!)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  })
  redirect(nextPath)
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect("/adminlog/kirjaudu?ulos=1")
}
