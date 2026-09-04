"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Newspaper, Tv, Radio, Globe, Building2, User, Rss, MapPin, AlertCircle, ShieldCheck, FileText, Layers } from "lucide-react"
import type { MediaOutlet } from "@/lib/media-data"
import { getBiasLabel, getBiasColor, getReliabilityLabel, getReliabilityColor, getPlatform, getEditorialFormat, getOrganizationalProfile, getPartyAffiliation, getTopicalFocus, getProductionOriginality } from "@/lib/media-data"
import { useLanguage } from "@/lib/language-context"

interface MediaModalProps {
  media: MediaOutlet | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getTypeIcon(type: string) {
  switch (type) {
    case "TV":
    case "Televizija":
      return <Tv className="h-5 w-5" />
    case "Radio":
      return <Radio className="h-5 w-5" />
    case "Web":
    case "Spletni portal":
      return <Globe className="h-5 w-5" />
    case "Agency":
    case "Agencija":
      return <Rss className="h-5 w-5" />
    default:
      return <Newspaper className="h-5 w-5" />
  }
}

export function MediaModal({ media, open, onOpenChange }: MediaModalProps) {
  const { lang, t } = useLanguage()
  
  if (!media) return null

  const biasPosition = ((media.bias + 1) / 2) * 100
  
  const platform = getPlatform(media)
  const format = getEditorialFormat(media)
  const orgProfile = getOrganizationalProfile(media)
  const partyAff = getPartyAffiliation(media)
  const topicalFocus = getTopicalFocus(media)
  const originality = getProductionOriginality(media)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {getTypeIcon(platform)}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{media.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {platform} • {format}
                {media.isInternational && media.country && (
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    <MapPin className="h-3 w-3 mr-1" />
                    {media.country}
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-3">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {media.description[lang]}
          </p>

          {/* SDS Network Warning */}
          {media.network && (
            <div className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  {t.sdsNetworkWarning}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {t.sdsNetworkDescription}
                </p>
              </div>
            </div>
          )}

          {/* SKLOP 1: Osnovni profil in struktura */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{t.basicProfile || "1. Osnovni profil"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block mb-0.5">{t.platformLabel || "Platforma"}:</span>
                <span className="font-medium text-foreground">{platform}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">{t.organizationalProfileLabel || "Organizacijski profil"}:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className="font-medium text-xs">{orgProfile}</Badge>
                  {partyAff === "Strankarsko povezan" && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      {t.partyAffiliated || "Strankarsko povezan"}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">{t.topicalFocusLabel || "Tematski fokus"}:</span>
                <span className="font-medium text-foreground">{topicalFocus}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">{t.productionOriginalityLabel || "Izvirnost produkcije"}:</span>
                <span className="font-medium text-foreground">{originality}</span>
              </div>
              <div className="sm:col-span-2 pt-1">
                <span className="text-muted-foreground block mb-0.5">{t.owner}:</span>
                <span className="font-medium text-foreground">{media.owner}</span>
              </div>
            </div>
          </div>

          {/* SKLOP 2: Uredniški profil in objektivnost */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>{t.editorialProfile || "2. Uredniške lastnosti"}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.editorialFormatLabel || "Prevladujoči uredniški format"}:</span>
                <Badge variant="secondary" className="font-semibold">{format}</Badge>
              </div>
            </div>

            {/* Objectivity indicator */}
            <div className="space-y-1.5 pt-1 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{(t as any).objectivityAxis || "Objektivnost poročanja"}:</span>
                <span className="text-xs font-bold text-foreground">
                  {Math.round((media.objectivity ?? (1 - Math.abs(media.bias))) * 100)}%
                </span>
              </div>
              <Progress value={(media.objectivity ?? (1 - Math.abs(media.bias))) * 100} className="h-2" />
            </div>

            {/* Political Bias Scale (Secondary/Legacy) */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{t.politicalBias} (okvirno):</span>
                <Badge className={getBiasColor(media.bias)}>
                  {getBiasLabel(media.bias, lang)}
                </Badge>
              </div>
              <div className="relative h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-slate-400 to-red-600">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-foreground rounded-full shadow-md transition-all"
                  style={{ left: `calc(${biasPosition}% - 7px)` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{t.left}</span>
                <span>{t.center}</span>
                <span>{t.right}</span>
              </div>
            </div>
          </div>

          {/* SKLOP 3: Ocena integritete in dejstvene zanesljivosti */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{t.integrityAssessment || "3. Ocena dejstvene zanesljivosti in preverjenosti"}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{(t as any).verificationAxis || "Preverjenost informacij"}:</span>
                <span className={`text-sm font-bold ${getReliabilityColor(media.reliability)}`}>
                  {Math.round((media.verification ?? media.reliability) * 100)}% ({getReliabilityLabel(media.reliability, lang)})
                </span>
              </div>
              <Progress value={(media.verification ?? media.reliability) * 100} className="h-2.5" />
            </div>

            <div className="mt-3 pt-2 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                {t.methodologyExplanationNote || "Metodološko pojasnilo: Ocena meri točnost navedenih dejstev, virov in podatkov v objavljenih prispevkih na podlagi analize preverjanja dejstev (fact-checking)."}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild variant="default" size="sm">
              <a href={media.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                {t.visitWebsite}
              </a>
            </Button>
            {media.podcrtoLink && (
              <Button asChild variant="outline" size="sm">
                <a href={media.podcrtoLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t.podcrtoAnalysis}
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
