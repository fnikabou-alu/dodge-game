"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ArtistData } from "@/lib/data"

type Metric = "weeks" | "entries" | "num1weeks"

const meta: Record<Metric, { key: keyof ArtistData; field: Metric; label: string }> = {
  weeks: { key: "byWeeks", field: "weeks", label: "Total weeks on chart" },
  entries: { key: "byEntries", field: "entries", label: "Charting songs" },
  num1weeks: { key: "byNo1", field: "num1weeks", label: "Weeks at No. 1" },
}

export function ArtistRankChart({ data }: { data: ArtistData }) {
  const [metric, setMetric] = useState<Metric>("weeks")
  const m = meta[metric]
  const rows = (data[m.key] as ArtistData["byWeeks"]).slice(0, 12).map((a) => ({
    artist: a.artist,
    value: a[m.field],
  }))

  const config = { value: { label: m.label, color: "var(--chart-1)" } }

  return (
    <div>
      <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
        <TabsList>
          <TabsTrigger value="weeks">Weeks charting</TabsTrigger>
          <TabsTrigger value="entries">Total hits</TabsTrigger>
          <TabsTrigger value="num1weeks">Weeks at No. 1</TabsTrigger>
        </TabsList>
      </Tabs>

      <ChartContainer config={config} className="mt-4 aspect-[4/3] w-full md:aspect-[16/9]">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ left: 8, right: 28, top: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            type="category"
            dataKey="artist"
            tickLine={false}
            axisLine={false}
            width={140}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
