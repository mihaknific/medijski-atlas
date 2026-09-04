"use client"

interface ReliabilityScaleProps {
  compact?: boolean
  lang?: "sl" | "en"
}

export function ReliabilityScaleVisual({ compact = false, lang = "sl" }: ReliabilityScaleProps) {
  const isSl = lang === "sl"

  const segments = [
    {
      range: "75–100%",
      label: isSl ? "Visoka zanesljivost" : "High Reliability",
      color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      desc: isSl
        ? "Dosledno navajanje preverjenih virov, jasna ločitev mnenj od novic in javna politika popravkov napak."
        : "Consistent primary source attribution, clear distinction of news from opinion, transparent corrections policy."
    },
    {
      range: "55–74%",
      label: isSl ? "Srednja zanesljivost" : "Medium Reliability",
      color: "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
      desc: isSl
        ? "Pretežno točno poročanje, a z občasnim mešanjem mnenj in dejstev ali enostransko izbranimi viri."
        : "Mostly accurate reporting, with occasional mixing of opinion with news or selective sourcing."
    },
    {
      range: "35–54%",
      label: isSl ? "Nizka zanesljivost" : "Low Reliability",
      color: "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300",
      dot: "bg-orange-500",
      desc: isSl
        ? "Pogosta nepreverjenost, izrazita senzacionalnost ali pristransko navajanje delnih dejstev."
        : "Frequent unverified claims, high sensationalism, or biased partial fact presentation."
    },
    {
      range: "0–34%",
      label: isSl ? "Zelo nizka zanesljivost" : "Very Low Reliability",
      color: "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300",
      dot: "bg-red-500",
      desc: isSl
        ? "Sistematično zavajanje, odsotnost novinarskih standardov in delovanje kot propagandno glasilo."
        : "Systematic disinformation, lack of journalistic standards, and operating as propaganda."
    },
  ]

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {segments.map((seg) => (
          <div
            key={seg.range}
            className={`p-3 rounded-lg border text-xs space-y-1.5 ${seg.color}`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${seg.dot}`} />
                {seg.label}
              </span>
              <span className="font-mono text-[11px] opacity-90">{seg.range}</span>
            </div>
            <p className="text-[11px] opacity-90 leading-snug">{seg.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground italic text-center">
        {isSl
          ? "Kriterijsko vrednotenje temelji na spoštovanju novinarskega kodeksa in standardov preverjanja dejstev."
          : "Criterion-referenced scoring based on adherence to journalistic codes and fact-verification standards."}
      </p>
    </div>
  )
}
