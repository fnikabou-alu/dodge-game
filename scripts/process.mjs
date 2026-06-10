import fs from "node:fs"
import readline from "node:readline"

const SRC = "data/billboard.csv"
const OUT = "public/data"
fs.mkdirSync(OUT, { recursive: true })

// CSV line parser handling quoted fields
function parseLine(line) {
  const out = []
  let cur = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQ = false
      } else cur += c
    } else {
      if (c === '"') inQ = true
      else if (c === ",") {
        out.push(cur)
        cur = ""
      } else cur += c
    }
  }
  out.push(cur)
  return out
}

// Aggregation containers
const songKey = (song, artist) => `${song}\u0000${artist}`

const songStats = new Map() // key -> {song, artist, weeks, peak, debut, last, num1weeks}
const artistStats = new Map() // artist -> {entries:Set, weeks, num1weeks, peakBest, top10weeks}
const yearStats = new Map() // year -> {num1Set:Set, entriesSet:Set, turnoverDebuts}
const decadeArtist = new Map() // decade -> Map(artist -> weeks)
const num1ByDate = new Map() // date -> {song,artist} the #1 that week

let totalRows = 0
const allDates = new Set()

const rl = readline.createInterface({ input: fs.createReadStream(SRC), crlfDelay: Infinity })
let first = true

for await (const line of rl) {
  if (first) {
    first = false
    continue
  }
  if (!line.trim()) continue
  const f = parseLine(line)
  if (f.length < 7) continue
  const [date, rankS, song, artist, lastS, peakS, weeksS] = f
  const rank = +rankS
  const peak = +peakS
  const weeks = +weeksS
  if (!date || !song || !artist || !rank) continue
  totalRows++
  allDates.add(date)
  const year = +date.slice(0, 4)
  const decade = Math.floor(year / 10) * 10

  const k = songKey(song, artist)
  let s = songStats.get(k)
  if (!s) {
    s = { song, artist, weeks: 0, peak: 101, debut: date, last: date, num1weeks: 0, top10: 0 }
    songStats.set(k, s)
  }
  s.weeks++
  if (rank < s.peak) s.peak = rank
  if (date < s.debut) s.debut = date
  if (date > s.last) s.last = date
  if (rank === 1) s.num1weeks++
  if (rank <= 10) s.top10++

  let a = artistStats.get(artist)
  if (!a) {
    a = { entries: new Set(), weeks: 0, num1weeks: 0, peakBest: 101, top10: 0 }
    artistStats.set(artist, a)
  }
  a.entries.add(k)
  a.weeks++
  if (rank === 1) a.num1weeks++
  if (rank <= 10) a.top10++
  if (peak < a.peakBest) a.peakBest = peak

  let y = yearStats.get(year)
  if (!y) {
    y = { num1: new Set(), entries: new Set(), debuts: 0, rows: 0 }
    yearStats.set(year, y)
  }
  y.entries.add(k)
  y.rows++
  if (rank === 1) y.num1.add(k)
  if (weeks === 1) y.debuts++

  if (!decadeArtist.has(decade)) decadeArtist.set(decade, new Map())
  const dm = decadeArtist.get(decade)
  dm.set(artist, (dm.get(artist) || 0) + 1)

  if (rank === 1) {
    if (!num1ByDate.has(date)) num1ByDate.set(date, { song, artist })
  }
}

const dates = [...allDates].sort()
const minDate = dates[0]
const maxDate = dates[dates.length - 1]

// --- Derived tables ---

const songArr = [...songStats.values()]

const longevity = [...songArr]
  .sort((a, b) => b.weeks - a.weeks)
  .slice(0, 25)
  .map((s) => ({ song: s.song, artist: s.artist, weeks: s.weeks, peak: s.peak, debut: s.debut }))

// Longest #1 reigns (consecutive not tracked; total weeks at #1)
const num1Songs = songArr
  .filter((s) => s.num1weeks > 0)
  .sort((a, b) => b.num1weeks - a.num1weeks)
  .slice(0, 25)
  .map((s) => ({ song: s.song, artist: s.artist, weeksAtNo1: s.num1weeks, debut: s.debut }))

const artistArr = [...artistStats.entries()].map(([artist, a]) => ({
  artist,
  entries: a.entries.size,
  weeks: a.weeks,
  num1weeks: a.num1weeks,
  top10: a.top10,
  peakBest: a.peakBest,
}))

const topArtistsByWeeks = [...artistArr].sort((a, b) => b.weeks - a.weeks).slice(0, 25)
const topArtistsByEntries = [...artistArr].sort((a, b) => b.entries - a.entries).slice(0, 25)
const topArtistsByNo1 = [...artistArr]
  .filter((a) => a.num1weeks > 0)
  .sort((a, b) => b.num1weeks - a.num1weeks)
  .slice(0, 25)

// Yearly trends
const yearArr = [...yearStats.entries()]
  .map(([year, y]) => ({
    year,
    uniqueSongs: y.entries.size,
    no1Count: y.num1.size,
    debuts: y.debuts,
    rows: y.rows,
    turnover: y.rows ? +(y.debuts / y.rows * 100).toFixed(2) : 0,
  }))
  .sort((a, b) => a.year - b.year)

// Decade dominant artists (top 5 by weeks each decade)
const decades = [...decadeArtist.entries()]
  .map(([decade, m]) => {
    const top = [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([artist, weeks]) => ({ artist, weeks }))
    return { decade, top }
  })
  .sort((a, b) => a.decade - b.decade)

// Average song longevity per decade (avg weeks-on-board of songs that debuted that decade)
const decadeLong = new Map()
for (const s of songArr) {
  const dec = Math.floor(+s.debut.slice(0, 4) / 10) * 10
  if (!decadeLong.has(dec)) decadeLong.set(dec, { total: 0, count: 0, peakSum: 0 })
  const d = decadeLong.get(dec)
  d.total += s.weeks
  d.count++
}
const decadeLongevity = [...decadeLong.entries()]
  .map(([decade, d]) => ({ decade, avgWeeks: +(d.total / d.count).toFixed(1), songs: d.count }))
  .sort((a, b) => a.decade - b.decade)

const summary = {
  totalRows,
  totalCharts: dates.length,
  uniqueSongs: songStats.size,
  uniqueArtists: artistStats.size,
  minDate,
  maxDate,
  years: maxDate.slice(0, 4) - minDate.slice(0, 4),
  no1Songs: songArr.filter((s) => s.num1weeks > 0).length,
}

fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary))
fs.writeFileSync(`${OUT}/longevity.json`, JSON.stringify(longevity))
fs.writeFileSync(`${OUT}/num1.json`, JSON.stringify(num1Songs))
fs.writeFileSync(
  `${OUT}/artists.json`,
  JSON.stringify({ byWeeks: topArtistsByWeeks, byEntries: topArtistsByEntries, byNo1: topArtistsByNo1 }),
)
fs.writeFileSync(`${OUT}/yearly.json`, JSON.stringify(yearArr))
fs.writeFileSync(`${OUT}/decades.json`, JSON.stringify(decades))
fs.writeFileSync(`${OUT}/decadeLongevity.json`, JSON.stringify(decadeLongevity))

console.log("Summary:", summary)
console.log("Wrote JSON files to", OUT)
