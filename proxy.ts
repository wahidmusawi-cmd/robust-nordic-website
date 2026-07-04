import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { ADMIN_COOKIE, getAdminSecret, verifySessionToken } from "@/lib/admin/auth"

const intlMiddleware = createMiddleware(routing)

async function adminMiddleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  // The login page itself is always reachable.
  if (pathname === "/adminlog/kirjaudu") return NextResponse.next()

  const secret = getAdminSecret()
  if (!secret) {
    // No password configured: allow in development, force the setup screen in production.
    if (process.env.NODE_ENV !== "production") return NextResponse.next()
    return NextResponse.redirect(new URL("/adminlog/kirjaudu", req.url))
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (token && (await verifySessionToken(token, secret))) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/adminlog/kirjaudu", req.url)
  // Preserve the query string so re-login lands back on the same filters/page.
  const target = pathname + req.nextUrl.search
  if (target !== "/adminlog") loginUrl.searchParams.set("seuraava", target)
  return NextResponse.redirect(loginUrl)
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === "/adminlog" || pathname.startsWith("/adminlog/")) {
    return adminMiddleware(req)
  }
  return intlMiddleware(req)
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(fi|sv|en)/:path*",
    // Admin area (password gate, no locale handling)
    "/adminlog/:path*",
    "/adminlog",
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/fi/pathnames`) — but never for API routes,
    // the admin, or static files
    "/((?!_next|_vercel|api|adminlog|.*\\..*).*)",
  ],
}
