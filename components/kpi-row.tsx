import { KpiCard } from "@/components/kpi-card"
import type { Summary, YearRow, DecadeLongevity } from "@/lib/data"

export function KpiRow({
  summary,
  yearly,
  decadeLongevity,
}: {
  summary: Summary
  yearly: YearRow[]
  decadeLongevity: DecadeLongevity[]
}) {
  // Unique songs per year: early-60s peak vs recent
  const peakYear = yearly.reduce((a, b) => (b.uniqueSongs > a.uniqueSongs ? b : a), yearly[0])
  const recent = yearly.find((y) => y.year === 2019) ?? yearly[yearly.length - 1]
  const uniqueDrop = Math.round(((recent.uniqueSongs - peakYear.uniqueSongs) / peakYear.uniqueSongs) * 100)

  // Turnover early vs late
  const turn65 = yearly.find((y) => y.year === 1965)?.turnover ?? 0
  const turn19 = yearly.find((y) => y.year === 2019)?.turnover ?? 0
  const turnDelta = Math.round(turn19 - turn65)

  // Longevity: 1960s vs 1990s/2000s peak
  const d60 = decadeLongevity.find((d) => d.decade === 1960)?.avgWeeks ?? 0
  const d00 = decadeLongevity.find((d) => d.decade === 2000)?.avgWeeks ?? 0
  const longevityGrowth = Math.round(((d00 - d60) / d60) * 100)

  // Sparklines from yearly data (sampled)
  const sample = (key: keyof YearRow) => {
    const step = Math.ceil(yearly.length / 16)
    return yearly.filter((_, i) => i % step === 0).map((y) => y[key] as number)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Unique songs / year"
        value={recent.uniqueSongs.toLocaleString()}
        delta={`${uniqueDrop}%`}
        trend="down"
        positiveIsGood
        spark={sample("uniqueSongs")}
        context={
          <>
            Down from a <strong className="text-foreground">{peakYear.uniqueSongs}</strong>-song peak in{" "}
            {peakYear.year}. Far fewer titles cycle through the chart today.
          </>
        }
      />
      <KpiCard
        label="Chart turnover"
        value={`${turn19}`}
        unit="%"
        delta={`${turnDelta} pts`}
        trend="down"
        positiveIsGood
        spark={sample("turnover")}
        context={
          <>
            Share of weekly slots filled by new debuts fell from{" "}
            <strong className="text-foreground">{turn65}%</strong> in 1965. The chart churns slowly now.
          </>
        }
      />
      <KpiCard
        label="Avg. weeks on chart"
        value={`${d00}`}
        unit="wks"
        delta={`+${longevityGrowth}%`}
        trend="up"
        positiveIsGood
        spark={decadeLongevity.map((d) => d.avgWeeks)}
        context={
          <>
            A 2000s hit lasted twice as long as a 1960s hit (
            <strong className="text-foreground">{d60} wks</strong>). Streaming rewards staying power.
          </>
        }
      />
      <KpiCard
        label="No. 1 hits all-time"
        value={summary.no1Songs.toLocaleString()}
        delta={`${summary.years} yrs`}
        trend="neutral"
        context={
          <>
            Across <strong className="text-foreground">{summary.totalCharts.toLocaleString()}</strong> weekly charts and{" "}
            {summary.uniqueArtists.toLocaleString()} artists since {summary.minDate.slice(0, 4)}.
          </>
        }
      />
    </div>
  )
}
