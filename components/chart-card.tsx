import type { ReactNode } from "react"

export function ChartCard({
  title,
  subtitle,
  takeaway,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  takeaway?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-card-foreground">
            {title}
          </h3>
          {subtitle ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="flex-1 px-5 py-5">{children}</div>

      {takeaway ? (
        <div className="border-t border-border bg-muted/40 px-5 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Takeaway&nbsp;·&nbsp;
            </span>
            {takeaway}
          </p>
        </div>
      ) : null}
    </section>
  )
}
