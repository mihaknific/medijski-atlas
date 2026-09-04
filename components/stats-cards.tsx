"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Target, TrendingUp } from "lucide-react"
import type { MediaOutlet } from "@/lib/media-data"
import { useLanguage } from "@/lib/language-context"

interface StatsCardsProps {
  data: MediaOutlet[]
}

export function StatsCards({ data }: StatsCardsProps) {
  const { lang, t } = useLanguage()
  
  const totalMedia = data.length
  const avgReliability = data.length > 0 
    ? data.reduce((sum, m) => {
        const score = (m.verification !== undefined && m.objectivity !== undefined)
          ? (m.verification + m.objectivity) / 2
          : m.reliability
        return sum + score
      }, 0) / data.length 
    : 0
  
  const leftCount = data.filter((m) => m.bias < -0.15).length
  const centerCount = data.filter((m) => m.bias >= -0.15 && m.bias <= 0.15).length
  const rightCount = data.filter((m) => m.bias > 0.15).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{totalMedia}</p>
              <p className="text-sm text-muted-foreground">{t.mediaOutlets}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{Math.round(avgReliability * 100)}%</p>
              <p className="text-sm text-muted-foreground">{t.avgReliability}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-lg font-bold">
                <span className="text-blue-600">{leftCount}{lang === "sl" ? "L" : "L"}</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-slate-600">{centerCount}{lang === "sl" ? "S" : "C"}</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-red-600">{rightCount}{lang === "sl" ? "D" : "R"}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.distribution}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
