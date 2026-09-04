"use client"

import { useState, useMemo, useRef } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Label } from "recharts"
import { motion } from "framer-motion"
import { Circle, Image as ImageIcon } from "lucide-react"
import {
  mediaOutlets,
  type MediaOutlet,
  getBiasLabel,
  getObjectivityDotColor,
  getMediaLogoUrl,
} from "@/lib/media-data"
import { useLanguage } from "@/lib/language-context"

export type ChartMode = "objectivity" | "bias"

interface MediaScatterChartProps {
  data: MediaOutlet[]
  mode: ChartMode
  onSelectMedia: (media: MediaOutlet) => void
  minReliability?: number
}

function getBiasDotColor(bias: number): string {
  if (bias <= -0.5) return "#2563eb" // blue-600
  if (bias < -0.15) return "#60a5fa" // blue-400
  if (bias <= 0.15) return "#64748b" // slate-500
  if (bias < 0.5) return "#f87171" // red-400
  return "#dc2626" // red-600
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: MediaOutlet
  }>
  mode: ChartMode
  lang: "sl" | "en"
  t: any
}

function CustomTooltip({ active, payload, mode, lang, t }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const logoUrl = getMediaLogoUrl(data)
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg max-w-xs z-50">
        <div className="flex items-center gap-2 mb-1">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={data.name}
              className="w-6 h-6 object-contain rounded border border-border/50 p-0.5 bg-background shrink-0"
              onError={(e: any) => { e.currentTarget.style.display = "none" }}
            />
          )}
          <p className="font-semibold text-foreground leading-tight">{data.name}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-snug">
          {data.description[lang]}
        </p>
        <div className="border-t border-border my-2 pt-2 space-y-1">
          {mode === "objectivity" ? (
            <>
              <p className="text-sm text-muted-foreground">
                {t.verificationLabel || "Preverjenost informacij"}:{" "}
                <span className="font-medium text-foreground">{Math.round(data.verification * 100)}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t.objectivityLabel || "Objektivnost poročanja"}:{" "}
                <span className="font-medium text-foreground">{Math.round(data.objectivity * 100)}%</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {t.bias}: <span className="font-medium text-foreground">{getBiasLabel(data.bias, lang)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t.reliability}: <span className="font-medium text-foreground">{Math.round(data.reliability * 100)}%</span>
              </p>
            </>
          )}
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.owner}</span>
          </p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground italic">{t.clickForDetails}</p>
      </div>
    )
  }
  return null
}

const staticAllMedia = [...mediaOutlets].sort((a, b) => a.id - b.id)
function CustomAnimatedDot(props: any) {
  const { cx, cy, payload, dotState, mode, viewMode, hoveredId, onHover, onSelectMedia } = props

  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return null

  const state = dotState || "STATIONARY"
  const hash = ((payload.id * 13 + 7) % 23)
  const staggerDelay = hash * 0.037
  const springStiffness = 90 + (hash % 5) * 16
  const springDamping = 11 + (hash % 4) * 2
  const springMass = 0.6 + (hash % 3) * 0.15
  const dotColor = mode === "objectivity"
    ? getObjectivityDotColor(payload.objectivity)
    : getBiasDotColor(payload.bias)

  const isLogos = viewMode === "logos"
  const logoUrl = isLogos ? getMediaLogoUrl(payload) : ""

  const isHovered = hoveredId === payload.id
  const hasActiveHover = hoveredId !== null
  const isDimmed = hasActiveHover && !isHovered

  // Pure CSS smooth hover transition style (avoids triggering React/Framer motion re-layouts)
  const hoverStyle: React.CSSProperties = {
    transition: "transform 0.2s ease-out, filter 0.2s ease-out, opacity 0.2s ease-out",
    transformOrigin: `${cx}px ${cy}px`,
    transform: isHovered ? "scale(1.4)" : isDimmed ? "scale(0.88)" : "scale(1)",
    filter: isHovered
      ? "grayscale(0%) drop-shadow(0px 4px 10px rgba(0,0,0,0.35))"
      : isDimmed
      ? "grayscale(100%)"
      : "grayscale(0%) drop-shadow(0px 2px 4px rgba(0,0,0,0.15))",
    opacity: isDimmed ? 0.25 : 1,
    cursor: "pointer",
  }

  const renderShape = () => {
    if (isLogos && logoUrl) {
      const size = 28
      const pad = 3
      const cardWidth = size + pad * 2
      const cardHeight = size + pad * 2
      return (
        <g style={hoverStyle}>
          {/* Solid white backing card to completely block overlapping elements and PNG transparency */}
          <rect
            x={cx - cardWidth / 2}
            y={cy - cardHeight / 2}
            width={cardWidth}
            height={cardHeight}
            rx={7}
            ry={7}
            fill="#ffffff"
            stroke={isHovered ? dotColor : "rgba(226, 232, 240, 0.9)"}
            strokeWidth={isHovered ? 2.5 : 1}
            style={{
              filter: isHovered
                ? `drop-shadow(0px 6px 14px ${dotColor}66)`
                : "drop-shadow(0px 2px 5px rgba(0,0,0,0.12))"
            }}
          />
          {/* Logo image centered on card */}
          <image
            href={logoUrl}
            x={cx - size / 2}
            y={cy - size / 2}
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={dotColor}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1.5}
        style={hoverStyle}
      />
    )
  }

  if (state === "STATIONARY") {
    return (
      <g
        onMouseEnter={() => onHover(payload.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation()
          onSelectMedia(payload)
        }}
      >
        {renderShape()}
      </g>
    )
  }

  if (state === "HIDDEN") return null

  if (state === "ENTERING") {
    return (
      <motion.g
        key={`${payload.id}_entering_${mode}_${viewMode}`}
        initial={{ x: 350, scale: 0, opacity: 0 }}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: springStiffness,
          damping: springDamping,
          mass: springMass,
          delay: staggerDelay,
        }}
        onMouseEnter={() => onHover(payload.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation()
          onSelectMedia(payload)
        }}
      >
        {renderShape()}
      </motion.g>
    )
  }

  if (state === "EXITING") {
    return (
      <motion.g
        key={`${payload.id}_exiting_${mode}_${viewMode}`}
        initial={{ x: 0, scale: 1, opacity: 1 }}
        animate={{ x: 350, scale: 0, opacity: 0 }}
        transition={{
          duration: 0.3 + (hash % 4) * 0.06,
          ease: [0.32, 0, 0.67, 0],
          delay: staggerDelay * 0.6,
        }}
        style={{ pointerEvents: "none" }}
      >
        {renderShape()}
      </motion.g>
    )
  }

  return null
}

export function MediaScatterChart({ data, mode, onSelectMedia, minReliability = 0 }: MediaScatterChartProps) {
  const { lang, t } = useLanguage()
  const [viewMode, setViewMode] = useState<"dots" | "logos">("dots")
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const currentActiveIds = useMemo(() => new Set(data.map((m) => m.id)), [data])
  const prevActiveIdsRef = useRef<Set<number> | null>(null)

  const dotStates = useMemo(() => {
    const prevSet = prevActiveIdsRef.current
    const nextSet = currentActiveIds
    const isInitialRender = prevSet === null

    const states: Record<number, "STATIONARY" | "ENTERING" | "EXITING" | "HIDDEN"> = {}

    staticAllMedia.forEach((media) => {
      const isActive = nextSet.has(media.id)

      if (isInitialRender) {
        states[media.id] = isActive ? "STATIONARY" : "HIDDEN"
      } else {
        const wasActive = prevSet.has(media.id)

        if (wasActive && isActive) {
          states[media.id] = "STATIONARY"
        } else if (!wasActive && isActive) {
          states[media.id] = "ENTERING"
        } else if (wasActive && !isActive) {
          states[media.id] = "EXITING"
        } else {
          states[media.id] = "HIDDEN"
        }
      }
    })

    prevActiveIdsRef.current = nextSet
    return states
  }, [currentActiveIds])

  const preparedChartData = useMemo(() => {
    const coordCounts: Record<string, number> = {}
    const coordIndices: Record<string, number> = {}

    staticAllMedia.forEach((item) => {
      // FOR OBJECTIVITY MODE: SWAP X AND Y AXES!
      // X-axis is now VERIFICATION
      // Y-axis is now OBJECTIVITY
      const xVal = mode === "objectivity" ? (item.verification ?? item.reliability) : item.bias
      const yVal = mode === "objectivity" ? (item.objectivity ?? (1 - Math.abs(item.bias))) : item.reliability
      const key = `${xVal.toFixed(2)}_${yVal.toFixed(2)}`
      coordCounts[key] = (coordCounts[key] || 0) + 1
    })

    return staticAllMedia.map((item) => {
      const obj = item.objectivity ?? (1 - Math.abs(item.bias))
      const ver = item.verification ?? item.reliability

      // SWAPPED: X = verification, Y = objectivity
      const xVal = mode === "objectivity" ? ver : item.bias
      const yVal = mode === "objectivity" ? obj : item.reliability
      const key = `${xVal.toFixed(2)}_${yVal.toFixed(2)}`

      const totalAtCoord = coordCounts[key]
      const currentIndex = coordIndices[key] || 0
      coordIndices[key] = currentIndex + 1

      let jitterX = 0
      let jitterY = 0

      if (totalAtCoord > 1) {
        const angle = (currentIndex / totalAtCoord) * 2 * Math.PI
        const radius = 0.022
        jitterX = Math.cos(angle) * radius
        jitterY = Math.sin(angle) * (radius * 0.7)
      }

      return {
        ...item,
        objectivity: obj,
        verification: ver,
        chartX: Number((xVal + jitterX).toFixed(3)),
        chartY: Number((yVal + jitterY).toFixed(3)),
        isActive: currentActiveIds.has(item.id),
      }
    })
  }, [currentActiveIds, mode])

  const isObj = mode === "objectivity"

  // Exact 0% to 100% domain limits
  const xDomain = isObj ? [0, 1.0] : [-1.0, 1.0]
  const xTicks = isObj ? [0, 0.25, 0.5, 0.75, 1.0] : [-1, -0.5, 0, 0.5, 1]
  const xTickFormatter = (value: number) => {
    if (isObj) return `${Math.round(value * 100)}%`
    if (Math.abs(value + 1) < 0.1) return t.left
    if (Math.abs(value) < 0.1) return t.center
    if (Math.abs(value - 1) < 0.1) return t.right
    return ""
  }

  const yDomain = [0, 1.0]
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0]
  const yTickFormatter = (value: number) => `${Math.round(value * 100)}%`

  // Clean, elegant professional axis labels
  const xAxisLabel = isObj
    ? (lang === "sl" ? "Preverjenost informacij (0% ──► 100%)" : "Information Verification (0% ──► 100%)")
    : t.politicalLean

  const yAxisLabel = isObj
    ? (lang === "sl" ? "Objektivnost poročanja (0% ──► 100%)" : "Reporting Objectivity (0% ──► 100%)")
    : t.factualReliability

  const excludedLabel = lang === "sl" ? "Izključeno" : "Excluded"

  return (
    <div className="relative w-full">
      {/* Element Display Mode Toggle Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs text-muted-foreground font-medium">
          {lang === "sl" ? "Način prikaza na grafu:" : "Chart display style:"}
        </span>
        <div className="flex items-center bg-muted/80 p-1 rounded-lg border border-border/50 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("dots")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "dots"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Circle className="h-3.5 w-3.5 fill-current opacity-70" />
            {lang === "sl" ? "Pikice" : "Dots"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("logos")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "logos"
                ? "bg-card text-foreground shadow-sm font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            {lang === "sl" ? "Logotipi medijev" : "Outlet Logos"}
          </button>
        </div>
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 30, right: 30, bottom: 45, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              type="number"
              dataKey="chartX"
              domain={xDomain}
              ticks={xTicks}
              tickFormatter={xTickFormatter}
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
            >
              <Label
                value={xAxisLabel}
                position="bottom"
                offset={22}
                className="fill-foreground/80 text-xs font-semibold tracking-wide"
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="chartY"
              domain={yDomain}
              ticks={yTicks}
              tickFormatter={yTickFormatter}
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
              width={50}
            >
              <Label
                value={yAxisLabel}
                angle={-90}
                position="insideLeft"
                offset={-10}
                className="fill-foreground/80 text-xs font-semibold tracking-wide"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            {minReliability > 0 && (
              <ReferenceArea
                x1={isObj ? 0 : -1}
                x2={1}
                y1={0}
                y2={minReliability}
                fill="#ef4444"
                fillOpacity={0.12}
                stroke="#ef4444"
                strokeOpacity={0.25}
                strokeDasharray="4 2"
              >
                <Label
                  value={`${excludedLabel} (<${Math.round(minReliability * 100)}%)`}
                  position="insideBottom"
                  offset={8}
                  className="fill-red-500/70 text-[10px] font-medium"
                />
              </ReferenceArea>
            )}

            {/* Very subtle reference line at midpoint X=50% without text labels */}
            <ReferenceLine
              x={isObj ? 0.5 : 0}
              stroke="#94a3b8"
              strokeDasharray="2 2"
              strokeWidth={0.7}
              strokeOpacity={0.6}
            />

            {/* Very subtle reference line at midpoint Y=50% without text labels */}
            <ReferenceLine
              y={0.5}
              stroke="#94a3b8"
              strokeDasharray="2 2"
              strokeWidth={0.7}
              strokeOpacity={0.6}
            />

            <Tooltip
              content={
                <CustomTooltip
                  mode={mode}
                  lang={lang}
                  t={t}
                />
              }
            />

            <Scatter
              data={preparedChartData}
              shape={(props: any) => (
                <CustomAnimatedDot
                  {...props}
                  mode={mode}
                  viewMode={viewMode}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  dotState={dotStates[props.payload?.id]}
                  onSelectMedia={onSelectMedia}
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with reversed ordered sequence from High to Very Low as requested */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 p-4 rounded-lg bg-muted/50 text-sm mt-4 border border-border/50">
        {isObj ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{lang === "sl" ? "Visoka (75 – 100%)" : "High (75 – 100%)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{lang === "sl" ? "Srednja (55 – 74%)" : "Medium (55 – 74%)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{lang === "sl" ? "Nizka (35 – 54%)" : "Low (35 – 54%)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{lang === "sl" ? "Zelo nizka (< 35%)" : "Very low (< 35%)"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{t.left}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-400 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{t.centerLeft}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-500 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{t.center}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{t.centerRight}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-600 shadow-sm" />
              <span className="text-muted-foreground text-xs font-medium">{t.right}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
