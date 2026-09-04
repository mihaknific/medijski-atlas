"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Scale, Users, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

// Legislation data from DNS
const legislationData = {
  zakoni: [
    { name: "Zakon o Slovenski tiskovni agenciji (ZSTAgen)", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO5765" },
    { name: "Zakon o avdiovizualnih medijskih storitvah", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO7871" },
    { name: "Zakon o Slovenskem filmskem centru", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO5645" },
    { name: "Zakon o medijih", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO1608" },
    { name: "Zakon o Radioteleviziji Slovenija", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO5617" },
    { name: "Zakon o avtorski in sorodnih pravicah (ZASP)", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO403" },
    { name: "Zakon o dostopu do informacij javnega značaja (ZDIJZ)", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO3025" },
    { name: "Kazenski zakonik (KZ-1)", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO5050" },
    { name: "Zakon o elektronskih komunikacijah (ZEKom-1)", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=ZAKO6405" },
  ],
  podzakonski: [
    { name: "Pravilnik o načinu prijavljanja TV/radijskih sprejemnikov", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=PRAV5066" },
    { name: "Pravilnik o vodenju razvida medijev", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=PRAV3999" },
    { name: "Pravilnik o programih posebnega pomena", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=PRAV5002" },
    { name: "Uredba o statusu samostojnega novinarja", url: "http://pisrs.si/Pis.web/pregledPredpisa?id=URED4049" },
  ],
  institucije: [
    { name: "Ministrstvo za kulturo", url: "https://www.gov.si/drzavni-organi/ministrstva/ministrstvo-za-kulturo/" },
    { name: "Urad vlade za komuniciranje", url: "https://www.gov.si/drzavni-organi/vladne-sluzbe/urad-vlade-za-komuniciranje/" },
    { name: "AKOS", url: "https://www.akos-rs.si/" },
    { name: "Informacijski pooblaščenec", url: "https://www.ip-rs.si/" },
    { name: "Varuh človekovih pravic", url: "https://www.varuh-rs.si/" },
  ],
}

// Media Analysis Tools data
const toolsData = {
  biasAnalysis: [
    { name: "Ground News", url: "https://groundnews.org" },
    { name: "AllSides", url: "https://www.allsides.com" },
    { name: "Ad Fontes Media - Interactive Media Bias Chart", url: "https://adfontesmedia.com/interactive-media-bias-chart/" },
  ],
  factChecking: [
    { name: "Media Bias/Fact Check", url: "https://mediabiasfactcheck.com" },
    { name: "NewsGuard", url: "https://www.newsguardtech.com" },
    { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check/" },
  ],
}

// Organizations data
const organizationsData = {
  slovenian: [
    { name: "Društvo novinarjev Slovenije", url: "https://novinar.com" },
    { name: "Sindikat novinarjev Slovenije", url: "https://sindikat-novinarjev.si" },
    { name: "Aktiv fotoreporterjev in fotografov", url: "https://fotoaktiv.si" },
    { name: "Društvo študentov novinarstva FEJS Slovenija", url: "https://fejs.si" },
  ],
  regional: [
    { name: "Hrvaško novinarsko društvo", url: "https://hnd.hr" },
    { name: "Sindikat novinarjev Hrvaške", url: "https://www.snh.hr" },
    { name: "Neodvisno združenje novinarjev Srbije", url: "https://nuns.rs" },
  ],
  international: [
    { name: "International Federation of Journalists (IFJ)", url: "https://www.ifj.org" },
    { name: "European Federation of Journalists (EFJ)", url: "https://europeanjournalists.org" },
    { name: "International Press Institute (IPI)", url: "https://ipi.media" },
    { name: "Committee to Protect Journalists (CPJ)", url: "https://www.cpj.org" },
    { name: "European Broadcasting Union (EBU)", url: "https://www.ebu.ch" },
    { name: "European Centre for Press and Media Freedom", url: "https://www.ecpmf.eu" },
    { name: "Platforma Sveta Evrope za zaščito novinarstva", url: "https://fom.coe.int/en/accueil" },
    { name: "UNESCO", url: "https://www.unesco.org" },
    { name: "Union de la presse francophone", url: "https://www.presse-francophone.org" },
  ],
  directories: [
    { name: "On-line Newspapers", url: "https://www.onlinenewspapers.com" },
    { name: "The Paper Boy", url: "https://www.thepaperboy.com" },
  ],
}

function LinkItem({ name, url }: { name: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
        {name}
      </span>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
    </a>
  )
}

function LinkSection({ title, items }: { title: string; items: { name: string; url: string }[] }) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">
        {title}
      </h4>
      <div className="space-y-0.5">
        {items.map((item, index) => (
          <LinkItem key={`${index}-${item.name}`} name={item.name} url={item.url} />
        ))}
      </div>
    </div>
  )
}

export function ResourcesSection() {
  const { lang, t } = useLanguage()
  
  const legislationLabels = lang === "sl" 
    ? { laws: "Zakoni", sublaws: "Podzakonski predpisi", institutions: "Institucije" }
    : { laws: "Laws", sublaws: "Regulations", institutions: "Institutions" }
  
  const orgLabels = lang === "sl"
    ? { slovenian: "Slovenske", regional: "Regionalne", international: "Mednarodne", directories: "Imeniki" }
    : { slovenian: "Slovenian", regional: "Regional", international: "International", directories: "Directories" }
  
  const toolLabels = lang === "sl"
    ? { biasAnalysis: "Analiza pristranskosti", factChecking: "Preverjanje dejstev" }
    : { biasAnalysis: "Bias Analysis", factChecking: "Fact Checking" }

  return (
    <section className="mt-12">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{t.resources}</CardTitle>
          </div>
          <CardDescription>{t.resourcesDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="legislation" className="space-y-4">
            <TabsList className="bg-muted/50 w-full justify-start">
              <TabsTrigger value="legislation" className="gap-2 data-[state=active]:bg-background">
                <Scale className="h-4 w-4" />
                {t.legislation}
              </TabsTrigger>
              <TabsTrigger value="organizations" className="gap-2 data-[state=active]:bg-background">
                <Users className="h-4 w-4" />
                {t.organizations}
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-2 data-[state=active]:bg-background">
                <Zap className="h-4 w-4" />
                {t.mediaTools}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="legislation" className="mt-0 pt-2">
              <div className="grid md:grid-cols-3 gap-6">
                <LinkSection title={legislationLabels.laws} items={legislationData.zakoni} />
                <LinkSection title={legislationLabels.sublaws} items={legislationData.podzakonski} />
                <LinkSection title={legislationLabels.institutions} items={legislationData.institucije} />
              </div>
            </TabsContent>
            
            <TabsContent value="organizations" className="mt-0 pt-2">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LinkSection title={orgLabels.slovenian} items={organizationsData.slovenian} />
                <LinkSection title={orgLabels.regional} items={organizationsData.regional} />
                <LinkSection title={orgLabels.international} items={organizationsData.international} />
                <LinkSection title={orgLabels.directories} items={organizationsData.directories} />
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="mt-0 pt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <LinkSection title={toolLabels.biasAnalysis} items={toolsData.biasAnalysis} />
                <LinkSection title={toolLabels.factChecking} items={toolsData.factChecking} />
              </div>
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border leading-relaxed">
                {lang === "sl" 
                  ? "Mednarodna orodja in platforme za analizo medijske pristranskosti ter preverjanje faktografske točnosti (uporabno predvsem za tuje medije in mednarodno primerjavo)." 
                  : "International tools and platforms for media bias analysis and fact-checking (primarily applicable for global media and international comparisons)."}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
