import { TopBar } from "@/components/top-bar"
import { KpiRow } from "@/components/kpi-row"
import { ChartCard } from "@/components/chart-card"
import { YearlyTrendChart } from "@/components/yearly-trend-chart"
import { DecadeLongevityChart } from "@/components/decade-longevity-chart"
import { ArtistRankChart } from "@/components/artist-rank-chart"
import { LongevityTable, No1Table } from "@/components/leaderboard-tables"
import { DecadeDominance } from "@/components/decade-dominance"
import {
  getSummary,
  getLongevity,
  getNo1,
  getArtists,
  getYearly,
  getDecades,
  getDecadeLongevity,
} from "@/lib/data"

export default function Page() {
  const summary = getSummary()
  const longevity = getLongevity()
  const no1 = getNo1()
  const artists = getArtists()
  const yearly = getYearly()
  const decades = getDecades()
  const decadeLongevity = getDecadeLongevity()

  const earlyTurnover = yearly.find((y) => y.year === 1965)?.turnover ?? 0
  const lateTurnover = yearly.find((y) => y.year === 2019)?.turnover ?? 0
  const topLongevity = longevity[0]
  const topNo1 = no1[0]
  const topArtist = artists.byWeeks[0]
  const topNo1Artist = artists.byNo1[0]
  const d60 = decadeLongevity.find((d) => d.decade === 1960)?.avgWeeks ?? 0
  const d00 = decadeLongevity.find((d) => d.decade === 2000)?.avgWeeks ?? 0

  return (
    <div className="min-h-dvh bg-background">
      <TopBar summary={summary} />

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
        {/* Title band */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Executive overview
            </p>
            <h1 className="mt-2 text-balance font-heading text-3xl font-bold uppercase leading-[0.95] tracking-tight md:text-4xl">
              How America&apos;s Charts Slowed Down &amp; Stayed Longer
            </h1>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Sixty-three years of the Billboard Hot 100 reveal one structural shift: the chart now moves far more
              slowly, with fewer new songs breaking through but each hit lasting dramatically longer. Here is what the
              data says &mdash; and who won.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Headline finding</p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums tracking-tight">
              {earlyTurnover}% &rarr; {lateTurnover}%
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">weekly chart turnover, 1965 vs 2019</p>
          </div>
        </div>

        {/* KPI cards */}
        <KpiRow summary={summary} yearly={yearly} decadeLongevity={decadeLongevity} />

        {/* Primary trend — full width */}
        <div className="mt-6">
          <ChartCard
            title="The Slowdown of the Hot 100"
            subtitle="Distinct songs charting each year (area) versus the rate of new debuts, or turnover (line), 1958–2021."
            takeaway={
              <>
                In the 1960s the chart was a fast-moving turnstile &mdash; turnover peaked near{" "}
                <strong className="text-foreground">{earlyTurnover}%</strong>. By 2019 it collapsed to roughly{" "}
                <strong className="text-foreground">{lateTurnover}%</strong>, and unique titles per year fell by more
                than half. Streaming rewards repeat listens, so fewer songs break through.
              </>
            }
          >
            <YearlyTrendChart data={yearly} />
          </ChartCard>
        </div>

        {/* Two-up: longevity + artists */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Hits Last Longer Than Ever"
            subtitle="Average weeks a song spends on the Hot 100, by debut decade."
            takeaway={
              <>
                A 2000s hit averaged <strong className="text-foreground">{d00} weeks</strong> versus just{" "}
                <strong className="text-foreground">{d60}</strong> in the 1960s. The endurance record:{" "}
                <strong className="text-foreground">{`"${topLongevity.song}"`}</strong> by {topLongevity.artist} at{" "}
                {topLongevity.weeks} weeks.
              </>
            }
          >
            <DecadeLongevityChart data={decadeLongevity} />
          </ChartCard>

          <ChartCard
            title="Who Dominated the Hot 100"
            subtitle="The most successful acts of all time. Switch metrics to compare chart presence, hit volume, and time at No. 1."
            takeaway={
              <>
                <strong className="text-foreground">{topArtist.artist}</strong> leads in cumulative weeks (
                {topArtist.weeks.toLocaleString()}), but <strong className="text-foreground">{topNo1Artist.artist}</strong>{" "}
                ruled the summit with {topNo1Artist.num1weeks}&nbsp;weeks at No. 1 &mdash; dominance and longevity reward
                different strategies.
              </>
            }
          >
            <ArtistRankChart data={artists} />
          </ChartCard>
        </div>

        {/* Two-up leaderboards */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Endurance Records"
            subtitle="The songs that simply refused to leave the chart."
            takeaway={
              <>
                Many of the longest-charting songs never hit No. 1 &mdash; they earned their place through years of
                steady mid-chart presence rather than a single explosive peak.
              </>
            }
          >
            <LongevityTable data={longevity} />
          </ChartCard>

          <ChartCard
            title="Kings & Queens of No. 1"
            subtitle="The songs that ruled the very top of the chart."
            takeaway={
              <>
                <strong className="text-foreground">{`"${topNo1.song}"`}</strong> by {topNo1.artist} reigned for{" "}
                <strong className="text-foreground">{topNo1.weeksAtNo1}&nbsp;weeks</strong> at No. 1 &mdash; the modern
                streaming-era benchmark for total dominance.
              </>
            }
          >
            <No1Table data={no1} />
          </ChartCard>
        </div>

        {/* Decade dominance — full width */}
        <div className="mt-6">
          <ChartCard
            title="The Sound of Each Decade"
            subtitle="The five acts with the most cumulative weeks on the Hot 100 within each decade."
            takeaway={
              <>
                Dominant names shift with each era&apos;s sound &mdash; from the 1960s British Invasion, through the
                2000s country-radio surge ({decades[5]?.top[0]?.artist}), to the 2010s streaming reign of{" "}
                {decades[6]?.top[0]?.artist} and {decades[6]?.top[1]?.artist}.
              </>
            }
          >
            <DecadeDominance data={decades} />
          </ChartCard>
        </div>

        <footer className="mt-8 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Source: Billboard Hot 100 weekly charts, {summary.minDate} &ndash; {summary.maxDate}.{" "}
            {summary.totalRows.toLocaleString()} chart entries · {summary.uniqueSongs.toLocaleString()} unique songs ·{" "}
            {summary.uniqueArtists.toLocaleString()} artists analyzed. Metrics precomputed from the full dataset.
          </p>
        </footer>
      </main>
    </div>
  )
}
