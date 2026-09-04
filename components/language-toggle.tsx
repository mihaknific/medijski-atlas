"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  
  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
      <Button
        variant={lang === "sl" ? "default" : "ghost"}
        size="sm"
        className="h-7 px-3 text-xs font-medium"
        onClick={() => setLang("sl")}
      >
        SLO
      </Button>
      <Button
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        className="h-7 px-3 text-xs font-medium"
        onClick={() => setLang("en")}
      >
        ENG
      </Button>
    </div>
  )
}
