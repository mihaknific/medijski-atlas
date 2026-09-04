"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ExternalLink } from "lucide-react"
import { ReliabilityScaleVisual } from "@/components/formatted-text"
import { useLanguage } from "@/lib/language-context"

export function MethodologySection() {
  const { lang, t } = useLanguage()

  const resources = [
    { name: "Pod črto", url: "https://podcrto.si",
      description: lang === "sl" ? "Preverjanje dejstev in raziskovalno novinarstvo" : "Fact-checking and investigative journalism" },
    { name: "Oštro", url: "https://ostro.si",
      description: lang === "sl" ? "Čezmejno neodvisno raziskovalno novinarstvo" : "Cross-border independent investigative journalism" },
    { name: "Reporters without Borders", url: "https://rsf.org",
      description: lang === "sl" ? "Svetovni indeks medijske svobode" : "Global media freedom index" },
    { name: "NewsGuard", url: "https://www.newsguardtech.com",
      description: lang === "sl" ? "Ocene zanesljivosti medijev" : "Media reliability ratings" },
  ]

  return (
    <section id="methodology" className="mt-16 scroll-mt-20">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t.methodology}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="bias" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="bias" className="cursor-pointer">{t.biasTab}</TabsTrigger>
              <TabsTrigger value="reliability" className="cursor-pointer">{t.reliabilityTab}</TabsTrigger>
              <TabsTrigger value="sources" className="cursor-pointer">{t.sourcesTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="bias" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-base font-semibold">
                    {lang === "sl" ? "Zakaj je objektivnost in preverjenost primarna mera?" : "Why Objectivity and Verification is Primary?"}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === "sl"
                      ? "Tradicionalna delitev medijev na 'leve' in 'desne' je vedno predmet javnih razprav in subjektivnih interpretacij (kaj je resnično levo ali desno, se spreminja glede na družbeni kontekst). Zato naš primarni graf temelji na objektivnosti poročanja (nevtralnost, odsotnost strankarske pristranskosti) in preverjenosti informacij (točnost podatkov in navajanje virov)."
                      : "Traditional categorization of media as 'left' or 'right' is inherently subjective and open to debate. Therefore, our primary visualization focuses on reporting objectivity (neutrality, lack of partisan bias) and information verification (factual accuracy and source attribution)."}
                  </p>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <h4 className="text-sm font-semibold">{t.howBiasDetermined}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.biasExplanation}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reliability" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold mb-2">{t.reliabilityScoring}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t.reliabilityExplanation}
                  </p>
                  <div className="my-4">
                    <ReliabilityScaleVisual lang={lang} />
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h5 className="text-sm font-semibold">{t.contentTypeExplanation}</h5>
                  
                  <div className="ml-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {lang === "sl" ? "Novični mediji (News)" : "News Outlets"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t.contentTypeExplanationNews}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {lang === "sl" ? "Mnenjski mediji (Opinion)" : "Opinion Outlets"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t.contentTypeExplanationOpinion}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {lang === "sl" ? "Mešani mediji (Mixed)" : "Mixed Outlets"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t.contentTypeExplanationMixed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-base font-semibold">{t.dataSources}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t.dataSourcesExplanation}
                </p>

                <div className="grid gap-3 mt-4">
                  {resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                          {resource.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <h5 className="text-sm font-semibold">{t.transparencyNote}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.transparencyExplanation}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
