import { isAdminConfigured } from "@/lib/admin/auth"
import { isStripeConfigured, stripeDashboardUrl } from "@/lib/admin/stripe"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { DemoBanner } from "@/components/admin/demo-banner"
import { logout } from "@/app/admin/kirjaudu/actions"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const isDemo = !isStripeConfigured()
  const unprotected = !isAdminConfigured() && process.env.NODE_ENV !== "production"

  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar stripeUrl={stripeDashboardUrl()} unprotected={unprotected} onLogout={logout} />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-6 lg:p-8">
          {isDemo && <DemoBanner />}
          {children}
        </main>
      </div>
    </div>
  )
}
