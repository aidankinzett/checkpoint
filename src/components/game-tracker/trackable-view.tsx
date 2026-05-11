import React, { useState } from 'react'
import { Check, ChevronDown, Search, RotateCcw } from 'lucide-react'
import type { TrackableItem } from '~/games/types'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'

interface TrackableViewProps {
  items: TrackableItem[]
  categories: string[]
  accent: string
  completed: Record<string, boolean>
  onToggle: (id: string) => void
  onReset: () => void
  itemLabel: string
  completedLabel: string
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function TrackableView({ items, categories, accent, completed, onToggle, onReset, itemLabel, completedLabel }: TrackableViewProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const completedCount = Object.keys(completed).length
  const totalCount = items.length

  const catCounts: Record<string, { total: number; done: number }> = {}
  categories.forEach((cat) => {
    const total = items.filter((item) => item.category === cat).length
    const done = items.filter((item) => item.category === cat && completed[item.id]).length
    catCounts[cat] = { total, done }
  })

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== "all" && item.category !== activeCategory) return false
    if (!showCompleted && completed[item.id]) return false
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
            placeholder={`Search ${itemLabel}...`}
            className="w-full py-2.5 pr-3.5 pl-[34px] rounded-md bg-[#111118] border-[#222] text-[#ddd] text-[14px] font-['Barlow',sans-serif] h-auto transition-colors focus-visible:ring-0"
            onFocus={(e) => { e.target.style.borderColor = accent }}
            onBlur={(e) => { e.target.style.borderColor = "#222" }}
          />
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2.5 mb-4 pb-4 border-b border-[#1a1a24]">
          <div className="flex gap-3 items-center">
            <label className="text-[12px] text-[#666] flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(!!checked)}
                style={{ '--checkbox-accent': accent } as React.CSSProperties}
                className="border-[#666] data-[state=checked]:bg-[var(--checkbox-accent)] data-[state=checked]:border-[var(--checkbox-accent)]"
              />
              Show {completedLabel}
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="inline-flex items-center gap-1.25 bg-transparent border-[#333] text-[#555] py-1 px-2.5 h-auto rounded text-[10px] font-bold font-['Barlow',sans-serif] tracking-[1px] hover:bg-transparent hover:text-[#777]"
            >
              <RotateCcw size={10} strokeWidth={2.25} />RESET ALL
            </Button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-[900px] mx-auto px-5 pb-10">
        {filtered.length === 0 && (
          <div className="text-center py-10 px-5 text-[#555] text-[14px]">
            {!showCompleted && completedCount > 0 ? `All visible ${itemLabel} ${completedLabel}! Toggle 'Show ${completedLabel}' to see them.` : `No ${itemLabel} match this filter.`}
          </div>
        )}
        {filtered.map((item) => {
          const done = !!completed[item.id]
          const isOpen = !!expanded[item.id]
          return (
            <div key={item.id} className="mb-1">
              <div
                className={`flex items-center gap-3.5 w-full py-3.5 px-4 cursor-pointer text-left font-['Barlow',sans-serif] transition-colors duration-150 border-solid border-[1px] ${isOpen ? "rounded-t-lg border-b-0" : "rounded-lg"} ${done ? "ach-row-done" : ""}`}
                onClick={() => toggleExpanded(item.id)}
                style={{
                  backgroundColor: done ? hexToRgba(accent, 0.04) : "#0f0f18",
                  borderColor: done ? hexToRgba(accent, 0.15) : "#1a1a26",
                }}>
                <div
                  onClick={(e) => { e.stopPropagation(); onToggle(item.id) }}
                  className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors border-[2px] border-solid"
                  style={{
                    borderColor: done ? accent : "#555",
                    backgroundColor: done ? accent : "transparent",
                  }}>
                  {done && <Check size={16} strokeWidth={3} color="#fff" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#ddd] flex items-center gap-2 flex-wrap">
                    <span className={done ? "opacity-50 line-through" : "opacity-100"}>{item.name}</span>
                    <span className="text-[9px] font-bold text-[#666] bg-[#1a1a26] py-[1px] px-1.5 rounded-[3px] tracking-[1px]">{item.category.toUpperCase()}</span>
                  </div>
                  {item.description && (
                    <div className={`text-[12px] text-[#888] mt-0.5 ${done ? "opacity-35" : "opacity-65"}`}>{item.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
                  <div className="flex flex-col gap-2">
                    {Object.entries(item.details ?? {}).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold tracking-[1px] whitespace-nowrap mt-[1px]" style={{ color: accent }}>{key.toUpperCase()}</span>
                        <p className="text-[13px] text-[#999] leading-[1.65] m-0">{value}</p>
                      </div>
                    ))}
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
