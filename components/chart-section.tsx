"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, Info, ShieldCheck, Scale, BookOpen } from "lucide-react"
import { ObjectivityChart } from "@/components/objectivity-chart"
import { BiasChart } from "@/components/bias-chart"
import { FilterPanel, type FilterState } from "@/components/filter-panel"
import { useLanguage } from "@/lib/language-context"
import type { MediaOutlet } from "@/lib/media-data"

interface ChartSectionProps {
  filteredMedia: MediaOutlet[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSelectMedia: (media: MediaOutlet) => void
}

export function ChartSection({
  filteredMedia,
  filters,
  onFiltersChange,
  onSelectMedia,
}: ChartSectionProps) {
  const { lang, t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"objectivity" | "legacy">("objectivity")

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Info Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {lang === "sl" ? "Metodološka navodila za branje grafa" : "Methodological Instructions for Chart Reading"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 text-sm pt-3">
                <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>{(t as any).tabNewChart || (lang === "sl" ? "Objektivnost in preverjenost" : "Objectivity & Verification")}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {(t as any).howToReadNewChart || (lang === "sl"
                      ? "Vodoravna os (X) meri stopnjo novinarske objektivnosti (od subjektivno-mnenjskega do nevtralno-analitičnega poročanja). Navpična os (Y) prikazuje raven faktografske preverjenosti informacij."
                      : "Horizontal axis (X) measures level of objectivity. Vertical axis (Y) indicates information verification standards.")}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/60 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span>{(t as any).tabLegacyChart || (lang === "sl" ? "Politična usmerjenost" : "Political Spectrum")}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {lang === "sl"
                      ? "Vodoravna os (X) ocenjuje zaznano vrednostno usmerjenost uredniške politike od levo (−1) do desno (+1). Navpična os (Y) prikazuje zanesljivost dejstev (0–100%)."
                      : "Horizontal axis (X) evaluates perceived editorial orientation (−1 to +1). Vertical axis (Y) shows factual reliability."}
                  </p>
                </div>

                <p className="text-[11px] text-muted-foreground italic text-center pt-1">
                  {lang === "sl"
                    ? "Kliknite na katero koli kroglico v grafu za podroben medijski profil."
                    : "Click any data point in the chart to open detailed media outlet profile."}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Left Column - Main Chart with Tab Switcher */}
      <div className="lg:col-span-3 space-y-6">
        <Tabs defaultValue="objectivity" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {activeTab === "objectivity"
                        ? ((t as any).chartTitleNew || (lang === "sl" ? "Zemljevid objektivnosti in preverjenosti medijev" : "Media Objectivity & Verification Map"))
                        : t.chartTitle}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {activeTab === "objectivity"
                        ? ((t as any).chartDescriptionNew || (lang === "sl" ? "Položaj na X-osi prikazuje stopnjo objektivnosti, Y-os pa preverjenost informacij" : "Position on X-axis shows level of objectivity, Y-axis shows information verification"))
                        : t.chartDescription}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                    title={lang === "sl" ? "Metodološka navodila za branje grafa (klikni za podrobnosti)" : "Methodological instructions (click for info)"}
                    aria-label={lang === "sl" ? "Metodološka navodila" : "Methodological instructions"}
                  >
                    <Info className="h-4 w-4 cursor-pointer" />
                  </button>

                  {/* Modern Tab Switcher */}
                  <TabsList className="bg-muted/80 p-1 rounded-lg border border-border/50">
                    <TabsTrigger
                      value="objectivity"
                      className="text-xs font-semibold px-3 py-1.5 gap-1.5 cursor-pointer data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {(t as any).tabNewChart || "Objektivnost in preverjenost"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="legacy"
                      className="text-xs font-semibold px-3 py-1.5 gap-1.5 cursor-pointer data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
                    >
                      <Scale className="h-3.5 w-3.5 text-slate-500" />
                      {(t as any).tabLegacyChart || "Politična usmerjenost"}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <TabsContent value="objectivity" className="mt-0 focus-visible:outline-none">
                <ObjectivityChart
                  data={filteredMedia}
                  onSelectMedia={onSelectMedia}
                  minReliability={filters.minReliability}
                />
              </TabsContent>

              <TabsContent value="legacy" className="mt-0 space-y-4 focus-visible:outline-none">
                {/* Academic Methodological Note for Political Spectrum */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed">
                  <div className="p-1.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-xs">
                      {lang === "sl" ? "Metodološka opomba:" : "Methodological Note:"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {(t as any).legacyChartWarning || (lang === "sl"
                        ? "Politična taksonomija (polarnost levo–desno) predstavlja poenostavljen in dinamičen socio-politični konstrukt, ki je predmet trajnih akademskih in javnih razprav. Ta prikaz ne meri faktografske točnosti poročanja, temveč zaznano vrednostno orientacijo uredniške politike. Za analizo novinarske kakovosti priporočamo primarni model objektivnosti in preverjenosti informacij."
                        : "Political taxonomy (left–right polarity) is a simplified socio-political construct subject to ongoing academic debate. This visualization measures perceived editorial orientation rather than factual accuracy.")}
                    </p>
                  </div>
                </div>

                <BiasChart
                  data={filteredMedia}
                  onSelectMedia={onSelectMedia}
                  minReliability={filters.minReliability}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Right Column - Filters */}
      <div className="space-y-6">
        <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </div>
  )
}
