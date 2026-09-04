"use client"

import { Button } from "@/components/ui/button"
import { Info, MapIcon } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/language-context"

export function HeaderSection() {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">{t.appName}</h1>
              <p className="text-xs text-muted-foreground">{t.appSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="outline" size="sm" asChild className="hidden sm:flex cursor-pointer">
              <a href="#methodology" className="cursor-pointer">
                <Info className="h-4 w-4 mr-2 text-primary" />
                {t.aboutMethodology}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
