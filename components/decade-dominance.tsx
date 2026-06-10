import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { DecadeTop } from "@/lib/data"

export function DecadeDominance({ data }: { data: DecadeTop[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((d) => {
        const max = d.top[0]?.weeks ?? 1
        return (
          <Card key={d.decade} className="gap-0 py-0">
            <CardHeader className="border-b border-border px-4 py-3">
              <span className="font-heading text-xl font-bold uppercase tracking-tight">{d.decade}s</span>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <ol className="space-y-2.5">
                {d.top.map((a, i) => (
                  <li key={a.artist}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        <span className="mr-1.5 font-mono text-xs text-muted-foreground">{i + 1}</span>
                        {a.artist}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{a.weeks}w</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(a.weeks / max) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
