"use client"

import { useState, useMemo, useEffect } from "react"
import { mediaOutlets, type MediaOutlet, getPlatform, getMediaCategory, getPartyAffiliation } from "@/lib/media-data"
import { MediaModal } from "@/components/media-modal"
import { FilterPanel, type FilterState } from "@/components/filter-panel"
import { StatsCards } from "@/components/stats-cards"
import { ResourcesSection } from "@/components/resources-section"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { HeaderSection } from "@/components/header-section"
import { HeroSection } from "@/components/hero-section"
import { ChartSection } from "@/components/chart-section"
import { MediaGridSection } from "@/components/media-grid-section"
import { MethodologySection } from "@/components/methodology-section"
import { FooterSection } from "@/components/footer-section"

/**
 * Main content component with all filtering and media management logic
 */
function MediaAtlasContent() {
  const { lang, t } = useLanguage()
  const [selectedMedia, setSelectedMedia] = useState<MediaOutlet | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    types: ["Web"],
    ownerTypes: [],
    minReliability: 0,
    contentFocus: "infoAndPolitical",
    partyTiesOnly: false,
  })

  /**
   * Filters media based on current filter state
   */
  const filteredMedia = useMemo(() => {
    return mediaOutlets.filter((media) => {
      if (filters.types.length === 0) {
        return false
      }
      const mediaTypes = media.types || []
      const platform = getPlatform(media)

      const matchesType = filters.types.some((filterType) => {
        if (filterType === "Print") {
          return (
            media.type === "Print" ||
            media.type === "Print/Web" ||
            platform === "Tiskani medij" ||
            platform === "Tiskovina + splet" ||
            mediaTypes.includes("Print")
          )
        } else if (filterType === "Web") {
          return (
            media.type === "Web" ||
            media.type === "Print/Web" ||
            platform === "Spletni portal" ||
            platform === "Tiskovina + splet" ||
            mediaTypes.includes("Web")
          )
        } else if (filterType === "Radio") {
          return (
            media.type === "Radio" ||
            platform === "Radio" ||
            mediaTypes.includes("Radio")
          )
        } else if (filterType === "TV") {
          return (
            media.type === "TV" ||
            platform === "Televizija" ||
            mediaTypes.includes("TV")
          )
        } else if (filterType === "Agency") {
          return (
            media.type === "Agency" ||
            platform === "Agencija" ||
            mediaTypes.includes("Agency")
          )
        }
        return (
          media.type === filterType ||
          platform === filterType ||
          mediaTypes.includes(filterType as any)
        )
      })
      if (!matchesType) return false

      if (filters.ownerTypes.length > 0 && !filters.ownerTypes.includes(media.ownerType)) {
        return false
      }
      if (media.reliability < filters.minReliability) {
        return false
      }

      // Content focus filtering (Informativni in družbeno-politični vs Vsi mediji)
      const focus = filters.contentFocus || "infoAndPolitical"
      const category = getMediaCategory(media)

      if (focus === "infoAndPolitical" && category === "Zabavni in tematski") {
        return false
      }

      // Party affiliation filter
      if (filters.partyTiesOnly && getPartyAffiliation(media) !== "Strankarsko povezan") {
        return false
      }

      return true
    })
  }, [filters])

  const handleSelectMedia = (media: MediaOutlet) => {
    setSelectedMedia(media)
    setModalOpen(true)
    // Update URL hash with proper encoding for special characters
    try {
      const slug = encodeURIComponent(media.name.toLowerCase().replace(/\s+/g, '-'))
      window.history.replaceState(null, '', `#media=${slug}`)
    } catch (error) {
      console.error('[v0] Error updating URL hash:', error)
    }
  }

  // Handle URL hash on component mount and when modal closes
  useEffect(() => {
    try {
      const hash = window.location.hash
      if (hash.startsWith('#media=')) {
        const encodedSlug = hash.replace('#media=', '')
        const slug = decodeURIComponent(encodedSlug)
        const found = mediaOutlets.find(m => 
          m.name.toLowerCase().replace(/\s+/g, '-') === slug
        )
        if (found) {
          setSelectedMedia(found)
          setModalOpen(true)
        }
      }
    } catch (error) {
      console.error('[v0] Error handling URL hash:', error)
    }
  }, [])

  const handleModalClose = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderSection />
      <HeroSection />

      <main className="container mx-auto px-4 py-8">
        <StatsCards data={filteredMedia} />
        <ChartSection
          filteredMedia={filteredMedia}
          filters={filters}
          onFiltersChange={setFilters}
          onSelectMedia={handleSelectMedia}
        />
        <MediaGridSection
          filteredMedia={filteredMedia}
          onSelectMedia={handleSelectMedia}
        />
        <ResourcesSection />
        <MethodologySection />
      </main>

      <FooterSection />

      <MediaModal
        media={selectedMedia}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <MediaAtlasContent />
    </LanguageProvider>
  )
}
