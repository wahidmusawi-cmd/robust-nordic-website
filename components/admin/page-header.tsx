import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  meta,
  actions,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  backHref?: string
  backLabel?: string
  /** Small inline elements rendered next to the title (badges etc.). */
  meta?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        {backHref && (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground mb-1 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {backLabel ?? "Takaisin"}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {meta}
        </div>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
