import { NextRequest, NextResponse } from "next/server"

// Simple in-memory rate limit: max 3 signups per IP per 10 minutes.
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 3

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 })
  }

  let email: string
  try {
    const body = await req.json()
    email = (body.email ?? "").toString().trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No key configured — silently succeed so the site stays functional.
    console.warn("RESEND_API_KEY not set, newsletter signup dropped for", email)
    return NextResponse.json({ ok: true })
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  const errors: string[] = []

  // 1. Add to Resend Audience (if configured)
  if (audienceId) {
    try {
      const res = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        },
      )
      if (!res.ok) {
        const text = await res.text()
        // 409 = contact already exists — not an error
        if (res.status !== 409) {
          console.error("Resend audience error:", res.status, text)
          errors.push("audience")
        }
      }
    } catch (err) {
      console.error("Resend audience fetch error:", err)
      errors.push("audience")
    }
  }

  // 2. Notify admin
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Robust Nordic <tilaukset@robustnordic.fi>",
        to: "asiakaspalvelu@robustnordic.fi",
        subject: "Uusi uutiskirjetilaaja",
        html: `<p>Uusi sähköpostitilaaja: <strong>${email}</strong></p>
               <p>Aika: ${new Date().toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })}</p>`,
      }),
    })
    if (!res.ok) {
      console.error("Resend admin notify error:", res.status, await res.text())
    }
  } catch (err) {
    console.error("Admin notify fetch error:", err)
  }

  return NextResponse.json({ ok: true })
}
