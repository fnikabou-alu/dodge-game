"use client"

import { Area, AreaChart, CartesianGrid, Line, ComposedChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { YearRow } from "@/lib/data"

const config = {
  uniqueSongs: { label: "Unique songs charting", color: "var(--chart-3)" },
  turnover: { label: "Chart turnover %", color: "var(--chart-1)" },
}

export function YearlyTrendChart({ data }: { data: YearRow[] }) {
  return (
    <ChartContainer config={config} className="aspect-[16/7] w-full">
      <ComposedChart data={data} margin={{ left: 4, right: 4, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(v) => `'${String(v).slice(2)}`}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v) => `${v}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-uniqueSongs)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-uniqueSongs)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          yAxisId="left"
          dataKey="uniqueSongs"
          type="monotone"
          fill="url(#fillUnique)"
          stroke="var(--color-uniqueSongs)"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          dataKey="turnover"
          type="monotone"
          stroke="var(--color-turnover)"
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
