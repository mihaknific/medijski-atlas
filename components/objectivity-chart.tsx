"use client"

import { MediaScatterChart } from "./media-scatter-chart"
import type { MediaOutlet } from "@/lib/media-data"

interface ObjectivityChartProps {
  data: MediaOutlet[]
  onSelectMedia: (media: MediaOutlet) => void
  minReliability?: number
}

export function ObjectivityChart(props: ObjectivityChartProps) {
  return <MediaScatterChart {...props} mode="objectivity" />
}
