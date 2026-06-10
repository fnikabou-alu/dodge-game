"use client"

import type { ReactNode } from "react"
import { Area, AreaChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type Trend = "up" | "down" | "neutral"

export function KpiCard({
  label,
  value,
  unit,
  delta,
  trend = "neutral",
  context,
  spark,
  positiveIsGood = true,
}: {
  label: string
  value: string
  unit?: string
  delta?: string
  trend?: Trend
  context: ReactNode
  spark?: number[]
  positiveIsGood?: boolean
}) {
  const toneGood = trend === "up" ? positiveIsGood : trend === "down" ? !positiveIsGood : null
  const deltaClass =
    toneGood === null
      ? "text-muted-foreground bg-muted"
      : toneGood
        ? "text-[var(--pos)] bg-[color-mix(in_oklch,var(--pos)_14%,transparent)]"
        : "text-primary bg-[color-mix(in_oklch,var(--primary)_12%,transparent)]"

  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus
  const sparkData = (spark ?? []).map((v, i) => ({ i, v }))
  const sparkColor = trend === "down" ? "var(--primary)" : "var(--pos)"

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums",
              deltaClass,
            )}
          >
            <Icon className="h-3 w-3" aria-hidden />
            {delta}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-3xl font-bold tabular-nums tracking-tight md:text-4xl">{value}</span>
          {unit ? <span className="text-sm font-medium text-muted-foreground">{unit}</span> : null}
        </div>
        {sparkData.length > 1 ? (
          <ChartContainer config={{ v: { label } }} className="h-10 w-24 shrink-0">
            <AreaChart data={sparkData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={`spark-${label.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparkColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                dataKey="v"
                type="monotone"
                stroke={sparkColor}
                strokeWidth={1.75}
                fill={`url(#spark-${label.replace(/\W/g, "")})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{context}</p>
    </div>
  )
}
