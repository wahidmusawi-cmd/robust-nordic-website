// Admin session auth. Edge-safe (Web Crypto only) so the same code runs in
// middleware and in server actions.

export const ADMIN_COOKIE = "rn_admin_session"
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const encoder = new TextEncoder()

/**
 * Secret used to sign session tokens. Falls back to the admin password so a
 * single ADMIN_PASSWORD env var is enough to run the whole admin.
 */
export function getAdminSecret(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET
  if (explicit && explicit.trim().length > 0) return explicit
  return isAdminConfigured() ? process.env.ADMIN_PASSWORD! : null
}

export function isAdminConfigured(): boolean {
  const pw = process.env.ADMIN_PASSWORD
  // The literal from .env.example doesn't count as a configured password.
  return typeof pw === "string" && pw.trim().length > 0 && pw !== "vahva-salasana"
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  return base64url(new Uint8Array(sig))
}

function base64url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Token format: `<expiryMs>.<hmac(expiryMs)>` */
export async function createSessionToken(secret: string, ttlMs: number = SESSION_TTL_MS): Promise<string> {
  const exp = String(Date.now() + ttlMs)
  const sig = await hmacSign(secret, exp)
  return `${exp}.${sig}`
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf(".")
  if (dot <= 0) return false
  const exp = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!/^\d+$/.test(exp)) return false
  if (Number(exp) < Date.now()) return false
  const expected = await hmacSign(secret, exp)
  return timingSafeEqual(sig, expected)
}

/**
 * Constant-time string comparison. Hashes both sides first so length
 * differences don't leak either.
 */
export async function safePasswordCompare(input: string, actual: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(input), sha256(actual)])
  return timingSafeEqual(a, b)
}

async function sha256(data: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(data))
  return base64url(new Uint8Array(digest))
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
