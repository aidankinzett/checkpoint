import React, { useState } from 'react'
import { Check, ChevronDown, Search, RotateCcw, Lock, BookOpen } from 'lucide-react'
import type { Achievement, TierConfig } from '~/games/types'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import { hexToRgba } from '~/lib/utils'

interface AchievementViewProps {
  achievements: Achievement[]
  categories: string[]
  tierConfig: Record<string, TierConfig>
  accent: string
  completed: Record<string, boolean>
  onToggle: (id: string) => void
  onReset: () => void
}

export function AchievementView({ achievements, categories, tierConfig, accent, completed, onToggle, onReset }: AchievementViewProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [filterTier, setFilterTier] = useState("all")
  const [search, setSearch] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [showStory, setShowStory] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const completedCount = Object.keys(completed).length
  const totalCount = achievements.length

  const catCounts: Record<string, { total: number; done: number }> = {}
  categories.forEach((cat) => {
    const total = achievements.filter((a) => a.category === cat).length
    const done = achievements.filter((a) => a.category === cat && completed[a.id]).length
    catCounts[cat] = { total, done }
  })

  const filtered = achievements.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== "all" && a.category !== activeCategory) return false
    if (filterTier !== "all" && a.tier !== filterTier) return false
    if (!showCompleted && completed[a.id]) return false
    if (!showStory && a.guide?.includes("cannot be missed")) return false
    return true
  })

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* CONTROLS */}
      <div className="max-w-[900px] mx-auto pt-4 px-5">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {["all", ...categories].map((cat) => {
            const isAll = cat === "all"
            const active = activeCategory === cat
            const label = isAll ? `ALL (${completedCount}/${totalCount})` : `${cat.toUpperCase()} (${catCounts[cat].done}/${catCounts[cat].total})`
            return (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="h-auto py-1.5 px-3 text-[11px] font-semibold font-['Barlow',sans-serif] tracking-[0.5px] rounded-md transition-colors hover:bg-transparent"
                style={{
                  backgroundColor: active ? hexToRgba(accent, 0.12) : "#111118",
                  borderColor: active ? accent : "#222",
                  color: active ? accent : "#777",
                }}
              >
                {label}
              </Button>
            )
          })}
        </div>
        <div className="mb-2.5 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex pointer-events-none text-[#555]">
            <Search size={14} strokeWidth={2} />
          </span>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search achievements..."
            className="w-full py-2.5 pr-3.5 pl-[34px] rounded-md bg-[#111118] border-[#222] text-[#ddd] text-[14px] font-['Barlow',sans-serif] h-auto transition-colors focus-visible:ring-0"
            onFocus={(e) => { e.target.style.borderColor = accent }}
            onBlur={(e) => { e.target.style.borderColor = "#222" }}
          />
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2.5 mb-4 pb-4 border-b border-[#1a1a24]">
          <div className="flex gap-1.5">
            {(["all", "gold", "silver", "bronze"] as const).map((t) => {
              const active = filterTier === t
              return (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterTier(t)}
                  className="h-auto py-[5px] px-2.5 text-[11px] font-semibold font-['Barlow',sans-serif] rounded-[5px] transition-colors hover:bg-transparent"
                  style={{
                    backgroundColor: active ? hexToRgba(accent, 0.08) : "transparent",
                    borderColor: active ? hexToRgba(accent, 0.4) : "#222",
                    color: active ? "#ccc" : "#555",
                  }}
                >
                  {t === "all" ? "ALL TIERS" : `${tierConfig[t].icon} ${tierConfig[t].label.toUpperCase()}`}
                </Button>
              )
            })}
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-[12px] text-[#666] flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={showStory}
                onCheckedChange={(checked) => setShowStory(!!checked)}
                style={{ '--checkbox-accent': accent } as React.CSSProperties}
                className="border-[#666] data-[state=checked]:bg-[var(--checkbox-accent)] data-[state=checked]:border-[var(--checkbox-accent)]"
              />
              Show story
            </label>
            <label className="text-[12px] text-[#666] flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(!!checked)}
                style={{ '--checkbox-accent': accent } as React.CSSProperties}
                className="border-[#666] data-[state=checked]:bg-[var(--checkbox-accent)] data-[state=checked]:border-[var(--checkbox-accent)]"
              />
              Show completed
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="inline-flex items-center gap-1.25 bg-transparent border-[#333] text-[#555] py-1 px-2.5 h-auto rounded text-[10px] font-bold font-['Barlow',sans-serif] tracking-[1px] hover:bg-transparent hover:text-[#777]"
            >
              <RotateCcw size={10} strokeWidth={2.25} />
              RESET ALL
            </Button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-[900px] mx-auto px-5 pb-10">
        {filtered.length === 0 && (
          <div className="text-center py-10 px-5 text-[#555] text-[14px]">
            {!showCompleted && completedCount > 0 ? "🕸️ All visible achievements completed! Toggle 'Show completed' to see them." : "No achievements match this filter."}
          </div>
        )}
        {filtered.map((a) => {
          const done = !!completed[a.id]
          const tier = tierConfig[a.tier]
          const isOpen = !!expanded[a.id]
          const isStory = !!a.guide?.includes("cannot be missed")
          return (
            <div key={a.id} className="mb-1">
              <div
                className={`flex items-center gap-3.5 w-full py-3.5 px-4 cursor-pointer text-left font-['Barlow',sans-serif] transition-colors duration-150 border-solid border-[1px] ${isOpen ? "rounded-t-lg border-b-0" : "rounded-lg"} ${done ? "ach-row-done" : ""}`}
                onClick={() => toggleExpanded(a.id)}
                style={{
                  backgroundColor: done ? hexToRgba(accent, 0.04) : "#0f0f18",
                  borderColor: done ? hexToRgba(accent, 0.15) : "#1a1a26",
                }}>
                <div
                  onClick={(e) => { e.stopPropagation(); onToggle(a.id) }}
                  className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors border-[2px] border-solid"
                  style={{
                    borderColor: done ? accent : tier.color,
                    backgroundColor: done ? accent : "transparent",
                  }}>
                  {done && <Check size={16} strokeWidth={3} color="#fff" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#ddd] flex items-center gap-2 flex-wrap">
                    <span className={done ? "opacity-50 line-through" : "opacity-100"}>{a.name}</span>
                    {a.secret && (
                      <span className="inline-flex items-center gap-[3px] text-[9px] font-bold text-[#666] bg-[#1a1a26] py-[1px] px-1.5 rounded-[3px] tracking-[1px]">
                        <Lock size={9} strokeWidth={2.5} />SECRET
                      </span>
                    )}
                    {isStory && (
                      <span className="inline-flex items-center gap-[3px] text-[9px] font-bold py-[1px] px-1.5 rounded-[3px] tracking-[1px]" style={{ color: accent, backgroundColor: hexToRgba(accent, 0.1) }}>
                        <BookOpen size={9} strokeWidth={2.5} />STORY
                      </span>
                    )}
                  </div>
                  <div className={`text-[12px] text-[#888] mt-0.5 ${done ? "opacity-35" : "opacity-65"}`}>{a.desc}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.25">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: tier.color }} />
                    <span className="text-[10px] font-bold tracking-[1px] uppercase" style={{ color: tier.color }}>{tier.label}</span>
                  </div>
                  <span className={`inline-flex transition-transform duration-200 opacity-40 text-[#888] ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown size={14} strokeWidth={1.75} />
                  </span>
                </div>
              </div>
              {isOpen && (
                <div
                  className="py-3.5 pr-4 pl-[58px] rounded-b-lg border-[1px] border-t-0 border-solid"
                  style={{
                    backgroundColor: done ? hexToRgba(accent, 0.02) : "#0c0c14",
                    borderColor: done ? hexToRgba(accent, 0.15) : "#1a1a26",
                  }}>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[11px] font-bold tracking-[1px] whitespace-nowrap mt-[1px]" style={{ color: accent }}>HOW TO</span>
                    <p className="text-[13px] text-[#999] leading-[1.65] m-0">{a.guide}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
