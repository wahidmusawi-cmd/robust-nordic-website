import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except: /api, /adminlog, /_next, /_vercel, static files
  matcher: ["/((?!api|adminlog|_next|_vercel|.*\\..*).*)"],
}
