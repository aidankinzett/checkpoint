import { useState } from 'react'
import { SUITS, SUIT_CATEGORIES } from '../data/suits'

interface SuitViewProps {
  unlocked: Record<string, boolean>
  onToggle: (id: string) => void
  onReset: () => void
}

export function SuitView({ unlocked, onToggle, onReset }: SuitViewProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [showUnlocked, setShowUnlocked] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const unlockedCount = Object.keys(unlocked).length
  const totalCount = SUITS.length

  const catCounts: Record<string, { total: number; done: number }> = {}
  SUIT_CATEGORIES.forEach((cat) => {
    const total = SUITS.filter((s) => s.category === cat).length
    const done = SUITS.filter((s) => s.category === cat && unlocked[s.id]).length
    catCounts[cat] = { total, done }
  })

  const filtered = SUITS.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== "all" && s.category !== activeCategory) return false
    if (!showUnlocked && unlocked[s.id]) return false
    return true
  })

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* CONTROLS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {["all", ...SUIT_CATEGORIES].map((cat) => {
            const isAll = cat === "all"
            const active = activeCategory === cat
            const label = isAll ? `ALL (${unlockedCount}/${totalCount})` : `${cat.toUpperCase()} (${catCounts[cat].done}/${catCounts[cat].total})`
            return (
              <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
                background: active ? "rgba(226,54,54,0.12)" : "#111118",
                border: `1px solid ${active ? "#E23636" : "#222"}`,
                color: active ? "#E23636" : "#777",
                padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                fontFamily: "'Barlow', sans-serif", letterSpacing: 0.5, cursor: "pointer",
              }}>{label}</button>
            )
          })}
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suits..."
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 6,
              background: "#111118", border: "1px solid #222", color: "#ddd",
              fontSize: 14, fontFamily: "'Barlow', sans-serif",
              outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#E23636" }}
            onBlur={(e) => { e.target.style.borderColor = "#222" }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #1a1a24" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={showUnlocked} onChange={() => setShowUnlocked(!showUnlocked)} style={{ accentColor: "#E23636" }} />
              Show unlocked
            </label>
            <button onClick={onReset} style={{ background: "transparent", border: "1px solid #333", color: "#555", padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "'Barlow', sans-serif", letterSpacing: 1, cursor: "pointer" }}>RESET ALL</button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 40px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 14 }}>
            {!showUnlocked && unlockedCount > 0 ? "\u{1F578}\u{FE0F} All visible suits unlocked! Toggle 'Show unlocked' to see them." : "No suits match this filter."}
          </div>
        )}
        {filtered.map((s) => {
          const done = !!unlocked[s.id]
          const isOpen = !!expanded[s.id]
          return (
            <div key={s.id} style={{ marginBottom: 4 }}>
              <div
                className={`ach-row ${done ? "ach-row-done" : ""}`}
                onClick={() => toggleExpanded(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, width: "100%",
                  padding: "14px 16px",
                  background: done ? "rgba(226,54,54,0.04)" : "#0f0f18",
                  border: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRadius: isOpen ? "8px 8px 0 0" : 8,
                  borderBottom: isOpen ? "none" : undefined,
                  cursor: "pointer", textAlign: "left", fontFamily: "'Barlow', sans-serif",
                }}>
                <div
                  className="check-circle"
                  onClick={(e) => { e.stopPropagation(); onToggle(s.id) }}
                  style={{
                    width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                    border: `2px solid ${done ? "#E23636" : "#555"}`,
                    background: done ? "#E23636" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, cursor: "pointer",
                  }}>
                  {done && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ opacity: done ? 0.5 : 1, textDecoration: done ? "line-through" : "none" }}>{s.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#666", background: "#1a1a26", padding: "1px 6px", borderRadius: 3, letterSpacing: 1 }}>{s.category.toUpperCase()}</span>
                    {s.power && <span style={{ fontSize: 9, fontWeight: 700, color: "#E23636", background: "rgba(226,54,54,0.1)", padding: "1px 6px", borderRadius: 3, letterSpacing: 1 }}>{s.power.toUpperCase()}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2, opacity: done ? 0.35 : 0.65 }}>{s.unlock}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", opacity: 0.4 }}>
                    <path d="M3 5L7 9L11 5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {isOpen && (
                <div style={{
                  padding: "14px 16px 14px 58px",
                  background: done ? "rgba(226,54,54,0.02)" : "#0c0c14",
                  borderLeft: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRight: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderBottom: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRadius: "0 0 8px 8px",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#E23636", whiteSpace: "nowrap", marginTop: 1 }}>UNLOCK</span>
                      <p style={{ fontSize: 13, color: "#999", lineHeight: 1.65, margin: 0 }}>{s.unlock}</p>
                    </div>
                    {s.power && s.powerDesc && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#E23636", whiteSpace: "nowrap", marginTop: 1 }}>POWER</span>
                        <p style={{ fontSize: 13, color: "#999", lineHeight: 1.65, margin: 0 }}>
                          <strong style={{ color: "#ccc" }}>{s.power}</strong> — {s.powerDesc}
                        </p>
                      </div>
                    )}
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
