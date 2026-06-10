import fs from "node:fs"
import path from "node:path"

const dir = path.join(process.cwd(), "public", "data")

function load<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as T
}

export type Summary = {
  totalRows: number
  totalCharts: number
  uniqueSongs: number
  uniqueArtists: number
  minDate: string
  maxDate: string
  years: number
  no1Songs: number
}

export type LongevitySong = {
  song: string
  artist: string
  weeks: number
  peak: number
  debut: string
}

export type No1Song = {
  song: string
  artist: string
  weeksAtNo1: number
  debut: string
}

export type Artist = {
  artist: string
  entries: number
  weeks: number
  num1weeks: number
  top10: number
  peakBest: number
}

export type ArtistData = {
  byWeeks: Artist[]
  byEntries: Artist[]
  byNo1: Artist[]
}

export type YearRow = {
  year: number
  uniqueSongs: number
  no1Count: number
  debuts: number
  rows: number
  turnover: number
}

export type DecadeTop = {
  decade: number
  top: { artist: string; weeks: number }[]
}

export type DecadeLongevity = {
  decade: number
  avgWeeks: number
  songs: number
}

export const getSummary = () => load<Summary>("summary.json")
export const getLongevity = () => load<LongevitySong[]>("longevity.json")
export const getNo1 = () => load<No1Song[]>("num1.json")
export const getArtists = () => load<ArtistData>("artists.json")
export const getYearly = () => load<YearRow[]>("yearly.json")
export const getDecades = () => load<DecadeTop[]>("decades.json")
export const getDecadeLongevity = () => load<DecadeLongevity[]>("decadeLongevity.json")
