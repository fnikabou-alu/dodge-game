import type { Summary } from "@/lib/data"
import { Disc3 } from "lucide-react"

export function TopBar({ summary }: { summary: Summary }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Disc3 className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="font-heading text-sm font-bold uppercase tracking-wide">Hot 100 Intelligence</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Billboard chart analytics
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--pos)]" aria-hidden />
            {summary.minDate.slice(0, 4)}&ndash;{summary.maxDate.slice(0, 4)}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] tabular-nums text-muted-foreground">
            {summary.totalRows.toLocaleString()} records
          </span>
        </div>
      </div>
    </header>
  )
}
