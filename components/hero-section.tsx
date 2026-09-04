"use client"

import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance leading-tight">
            {t.heroTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-pretty max-w-4xl">
            {t.heroDescription}
          </p>
        </div>
      </div>
    </section>
  )
}
