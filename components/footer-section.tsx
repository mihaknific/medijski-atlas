"use client"

import { useLanguage } from "@/lib/language-context"
import { DATA_LAST_UPDATED } from "@/lib/media-data"
import { ShieldAlert, Mail, Calendar, Info } from "lucide-react"

export function FooterSection() {
  const { t, lang } = useLanguage()

  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        {/* Main Brand & Status Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border/50 text-center sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 justify-center sm:justify-start">
              <Info className="h-5 w-5 text-primary shrink-0" />
              {t.footerText}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t.footerDisclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {lang === "sl"
                ? `Zadnja posodobitev: ${DATA_LAST_UPDATED}`
                : `Last update: ${DATA_LAST_UPDATED}`}
            </span>
          </div>
        </div>

        {/* Structured Legal Disclaimer Card */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm border-b border-border/40 pb-3">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <span>{lang === "sl" ? "Pravno obvestilo ter omejitev odgovornosti" : "Legal Notice & Limitation of Liability"}</span>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              {lang === "sl"
                ? "Medijski Atlas je neodvisen izobraževalno-raziskovalni projekt, namenjen spodbujanju medijske pismenosti. Vse objavljene ocene, analize pristranskosti in zanesljivosti temeljijo na javno dostopnih virih ter subjektivnih analitičnih ocenah in so izključno informativne narave."
                : "Media Atlas is an independent educational and research project aimed at promoting media literacy. All published ratings, bias analyses, and reliability scores are based on publicly available sources and analytical estimations and are strictly for informational purposes."}
            </p>
            <p>
              {lang === "sl"
                ? "Avtorji in upravljavci spletnega mesta v celoti izključujejo kakršnokoli pravno, odškodninsko ali vsebinsko odgovornost za točnost, popolnost ali aktualnost objavljenih podatkov ter ne odgovarjajo za kakršnokoli neposredno ali posredno škodo ali posledice, nastale na podlagi uporabe prikazanih informacij ali odločitev uporabnikov."
                : "The authors and operators of this website fully disclaim all legal, content, or financial liability for the accuracy, completeness, or timeliness of data, and shall not be held liable for any direct or indirect damage or decisions resulting from the use of the presented information."}
            </p>
          </div>

          {/* Contact Email Action */}
          <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">
              {lang === "sl" ? "Naleteteli na napako ali imate predlog za dopolnitev?" : "Found an error or have a suggestion?"}
            </span>
            <a
              href="mailto:kontakt@medijskiatlas.si"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              kontakt@medijskiatlas.si
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
