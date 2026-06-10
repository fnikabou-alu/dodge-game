"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DecadeLongevity } from "@/lib/data"

const config = {
  avgWeeks: { label: "Avg. weeks on chart", color: "var(--chart-1)" },
}

export function DecadeLongevityChart({ data }: { data: DecadeLongevity[] }) {
  const rows = data.map((d) => ({ ...d, label: `${d.decade}s` }))
  return (
    <ChartContainer config={config} className="aspect-[16/7] w-full">
      <BarChart data={rows} margin={{ left: 4, right: 4, top: 16, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="avgWeeks" fill="var(--color-avgWeeks)" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="avgWeeks"
            position="top"
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
