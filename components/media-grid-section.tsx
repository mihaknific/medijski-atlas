"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BarChart2, List, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaCard } from "@/components/media-card"
import { MediaList } from "@/components/media-list"
import { useLanguage } from "@/lib/language-context"
import type { MediaOutlet } from "@/lib/media-data"
import { getPlatform, getEditorialFormat, getOrganizationalProfile, getTopicalFocus, getProductionOriginality } from "@/lib/media-data"

interface MediaGridSectionProps {
  filteredMedia: MediaOutlet[]
  onSelectMedia: (media: MediaOutlet) => void
}

function exportToCSV(data: MediaOutlet[], lang: "sl" | "en") {
  const headers = lang === "sl"
    ? "Ime,Politična usmerjenost,Dejstvena zanesljivost,Platforma,Uredniški format,Organizacijski profil,Tematski fokus,Izvirnost produkcije,Lastnik,Spletna stran\n"
    : "Name,Political Bias,Factual Reliability,Platform,Editorial Format,Organizational Profile,Topical Focus,Production Originality,Owner,Website\n"
  const rows = data.map(m => {
    const platform = getPlatform(m)
    const format = getEditorialFormat(m)
    const orgProfile = getOrganizationalProfile(m)
    const topicalFocus = getTopicalFocus(m)
    const originality = getProductionOriginality(m)
    return `"${m.name}",${m.bias},${Math.round(m.reliability * 100)}%,"${platform}","${format}","${orgProfile}","${topicalFocus}","${originality}","${m.owner}","${m.website}"`
  }).join('\n')
  const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'medijski-atlas.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function MediaGridSection({
  filteredMedia,
  onSelectMedia,
}: MediaGridSectionProps) {
  const { lang, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const searchedMedia = filteredMedia.filter(media =>
    searchQuery === "" ||
    media.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="mt-12">
      <Tabs defaultValue="list" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">{t.allMediaOutlets}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(filteredMedia, lang)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {lang === "sl" ? "Izvozi CSV" : "Export CSV"}
            </Button>
          </div>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="grid" className="gap-2 cursor-pointer data-[state=active]:bg-background">
              <BarChart2 className="h-4 w-4" />
              {t.grid}
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2 cursor-pointer data-[state=active]:bg-background">
              <List className="h-4 w-4" />
              {t.list}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0 space-y-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchedMedia.map((media) => (
              <MediaCard
                key={`${media.isInternational ? 'int' : 'slo'}-${media.id}`}
                media={media}
                onClick={() => onSelectMedia(media)}
              />
            ))}
          </div>
          {searchedMedia.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t.showing} 0 {t.of} {filteredMedia.length}
            </p>
          ) : searchQuery ? (
            <p className="text-sm text-muted-foreground text-center">
              {t.showing} {searchedMedia.length} {t.of} {filteredMedia.length}
            </p>
          ) : null}
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <MediaList data={filteredMedia} onSelectMedia={onSelectMedia} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
