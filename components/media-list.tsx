"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Search, ArrowUpDown, ExternalLink, Info } from "lucide-react"
import type { MediaOutlet } from "@/lib/media-data"
import { getBiasLabel, getBiasColor, getReliabilityColor, getPlatform, getEditorialFormat, getOrganizationalProfile, getPartyAffiliation } from "@/lib/media-data"
import { useLanguage } from "@/lib/language-context"

interface MediaListProps {
  data: MediaOutlet[]
  onSelectMedia: (media: MediaOutlet) => void
}

type SortField = "name" | "bias" | "reliability"
type SortDirection = "asc" | "desc"

export function MediaList({ data, onSelectMedia }: MediaListProps) {
  const { lang, t } = useLanguage()
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("reliability")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const filteredData = data.filter((media) =>
    media.name.toLowerCase().includes(search.toLowerCase()) ||
    media.owner.toLowerCase().includes(search.toLowerCase())
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier
    }
    return (a[sortField] - b[sortField]) * modifier
  })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Info button for column header sorting */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 cursor-pointer" />
              <span>{lang === "sl" ? "Kako razvrščati?" : "How to sort?"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 text-xs space-y-2 p-3.5" align="end">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>{lang === "sl" ? "Razvrščanje v tabeli" : "Table Sorting"}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "sl"
                ? "Vsebino v tabeli lahko razvrščate neposredno s klikom na naslove stolpcev (Ime, Pristranskost ali Ocena dejstvene zanesljivosti)."
                : "You can sort the table content directly by clicking on the column headers (Name, Bias, or Factual Reliability Rating)."}
            </p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-semibold"
                  onClick={() => toggleSort("name")}
                >
                  {t.name}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-semibold"
                  onClick={() => toggleSort("bias")}
                >
                  {t.bias}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-semibold"
                  onClick={() => toggleSort("reliability")}
                >
                  {t.factualReliabilityLabel || t.reliability}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell font-semibold">{t.platformLabel || t.type}</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold">{t.editorialFormatLabel || t.content}</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold">{t.organizationalProfileLabel || t.owner}</TableHead>
              <TableHead className="text-right font-semibold">{t.link}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((media) => {
              const platform = getPlatform(media)
              const format = getEditorialFormat(media)
              const orgProfile = getOrganizationalProfile(media)
              const partyAff = getPartyAffiliation(media)
              return (
                <TableRow
                  key={media.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectMedia(media)}
                >
                  <TableCell className="font-medium">{media.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getBiasColor(media.bias)} text-[10px]`}>
                      {getBiasLabel(media.bias, lang)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getReliabilityColor(media.reliability)}`}>
                      {Math.round(media.reliability * 100)}%
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {platform}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {format}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground truncate max-w-[100px]">{orgProfile}</span>
                      {partyAff === "Strankarsko povezan" && (
                        <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4 shrink-0">
                          {lang === "sl" ? "Strank." : "Party"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={media.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {t.showing} {sortedData.length} {t.of} {data.length}
      </p>
    </div>
  )
}
