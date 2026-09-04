"use client"

import { MediaScatterChart } from "./media-scatter-chart"
import type { MediaOutlet } from "@/lib/media-data"

interface BiasChartProps {
  data: MediaOutlet[]
  onSelectMedia: (media: MediaOutlet) => void
  minReliability?: number
}

export function BiasChart(props: BiasChartProps) {
  return <MediaScatterChart {...props} mode="bias" />
}
