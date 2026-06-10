import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { LongevitySong, No1Song } from "@/lib/data"

export function LongevityTable({ data }: { data: LongevitySong[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead className="w-auto">Song</TableHead>
            <TableHead className="hidden w-[38%] sm:table-cell">Artist</TableHead>
            <TableHead className="w-16 text-right">Weeks</TableHead>
            <TableHead className="hidden w-20 text-right md:table-cell">Peak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s, i) => (
            <TableRow key={`${s.song}-${s.artist}`}>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">
                <span className="block truncate" title={s.song}>
                  {s.song}
                </span>
                <span className="block truncate text-xs text-muted-foreground sm:hidden" title={s.artist}>
                  {s.artist}
                </span>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                <span className="block truncate" title={s.artist}>
                  {s.artist}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{s.weeks}</TableCell>
              <TableCell className="hidden text-right md:table-cell">
                <Badge variant={s.peak === 1 ? "default" : "secondary"} className="tabular-nums">
                  {s.peak === 1 ? "No. 1" : `#${s.peak}`}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function No1Table({ data }: { data: No1Song[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead className="w-auto">Song</TableHead>
            <TableHead className="hidden w-[38%] sm:table-cell">Artist</TableHead>
            <TableHead className="w-24 text-right">Wks at No. 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s, i) => (
            <TableRow key={`${s.song}-${s.artist}`}>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">
                <span className="block truncate" title={s.song}>
                  {s.song}
                </span>
                <span className="block truncate text-xs text-muted-foreground sm:hidden" title={s.artist}>
                  {s.artist}
                </span>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                <span className="block truncate" title={s.artist}>
                  {s.artist}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{s.weeksAtNo1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
