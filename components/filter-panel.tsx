"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { RotateCcw, Landmark } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTypeLabels, getOwnerLabels } from "@/lib/translations"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FilterState {
  types: string[]
  ownerTypes: string[]
  minReliability: number
  politicalOnly?: boolean
  contentFocus: "infoAndPolitical" | "all"
  partyTiesOnly?: boolean
}

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const mediaTypes = ["Print", "Web", "TV", "Radio", "Print/Web", "Agency"]
const ownerTypes = ["State-owned", "Private", "Private-Tajkun", "Foreign", "Non-profit"]

const DEFAULT_TYPES = ["Web"]

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const { t } = useLanguage()

  const typeLabels = getTypeLabels(t)
  const ownerLabels = getOwnerLabels(t)

  const toggleFilter = (category: "types" | "ownerTypes", value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [category]: updated })
  }

  const resetFilters = () => {
    onFiltersChange({
      types: ["Web"],
      ownerTypes: [],
      minReliability: 0,
      politicalOnly: false,
      contentFocus: "infoAndPolitical",
      partyTiesOnly: false,
    })
  }

  const hasActiveFilters =
    filters.types.length !== 1 ||
    !filters.types.includes("Web") ||
    filters.ownerTypes.length > 0 ||
    filters.minReliability > 0 ||
    filters.contentFocus !== "infoAndPolitical" ||
    Boolean(filters.partyTiesOnly)

  const currentFocus = filters.contentFocus || "infoAndPolitical"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t.filters}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t.reset}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Primary Content Focus Section */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <Landmark className="h-4 w-4 text-primary shrink-0" />
            <Label className="text-sm font-semibold">
              {t.contentFocusLabel || "Fokus vsebin medija"}
            </Label>
          </div>

          <Select
            value={currentFocus}
            onValueChange={(val: "infoAndPolitical" | "all") =>
              onFiltersChange({ ...filters, contentFocus: val })
            }
          >
            <SelectTrigger className="w-full text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="infoAndPolitical">
                {t.contentFocusInfoAndPolitical || "Politično-informativni mediji (privzeto)"}
              </SelectItem>
              <SelectItem value="all">
                {t.contentFocusAll || "Vsi mediji (tudi ostali tematski in zabavni)"}
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-[11px] text-muted-foreground leading-snug pt-1">
            {currentFocus === "infoAndPolitical" && (t.contentFocusNoteInfo || "Prikazani so politično-informativni mediji: novičarski portali, tiskani dnevniki, TV ter informativne radijske postaje.")}
            {currentFocus === "all" && (t.contentFocusNoteAll || "Prikazani so vsi mediji v bazi (vključno z glasbenimi radii, revijami in tematskimi portali).")}
          </p>
        </div>

        {/* Party Affiliation Toggle */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Label htmlFor="party-ties-toggle" className="text-xs font-medium cursor-pointer">
              {t.partyTiesOnly || "Prikaži le strankarsko povezane medije"}
            </Label>
            <Switch
              id="party-ties-toggle"
              checked={filters.partyTiesOnly ?? false}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, partyTiesOnly: checked })
              }
            />
          </div>
        </div>

        {/* Reliability Slider */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t.minReliability}</Label>
            <span className="text-xs text-muted-foreground font-medium">
              {Math.round(filters.minReliability * 100)}%
            </span>
          </div>
          <Slider
            value={[filters.minReliability]}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, minReliability: value })
            }
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Media Type */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Label className="text-sm font-medium">{t.mediaType}</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {mediaTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => toggleFilter("types", type)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  {typeLabels[type]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Ownership */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.ownership}</Label>
          <div className="space-y-1.5">
            {ownerTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`owner-${type}`}
                  checked={filters.ownerTypes.includes(type)}
                  onCheckedChange={() => toggleFilter("ownerTypes", type)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={`owner-${type}`}
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  {ownerLabels[type]}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
