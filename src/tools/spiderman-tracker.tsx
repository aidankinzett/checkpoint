import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { emojiToFavicon, setFavicon } from '~/lib/favicon'
import { fetchSteamAchievements } from '~/server/steam-achievements'
import { ACHIEVEMENTS } from './spiderman-tracker/data/achievements'
import { SUITS } from './spiderman-tracker/data/suits'
import { STORAGE_KEY, SUITS_STORAGE_KEY, STEAM_PROFILE_KEY } from './spiderman-tracker/data/constants'
import { useTrackedMap } from '~/hooks/use-tracked-map'
import { AchievementView } from './spiderman-tracker/components/achievement-view'
import { SuitView } from './spiderman-tracker/components/suit-view'

export const meta = {
  title: 'Spider-Man Tracker',
  description: "Achievement tracker for Marvel's Spider-Man Remastered",
  icon: '🕷️',
}

type Tab = 'achievements' | 'suits'

export default function SpiderManTracker() {
  const [activeTab, setActiveTab] = useState<Tab>('achievements')
  const achievements = useTrackedMap(STORAGE_KEY)
  const suits = useTrackedMap(SUITS_STORAGE_KEY)

  const [steamProfile, setSteamProfile] = useState(() => {
    try { return localStorage.getItem(STEAM_PROFILE_KEY) || "" } catch { return "" }
  })
  const [importCount, setImportCount] = useState<number | null>(null)

  useEffect(() => {
    const href = emojiToFavicon('\u{1F577}\u{FE0F}')
    setFavicon(href)
    return () => {
      setFavicon("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>\u{1F6E0}\u{FE0F}</text></svg>")
    }
  }, [])

  const steamImport = useMutation({
    mutationFn: async (profile: string) => {
      return fetchSteamAchievements({ data: { profile } })
    },
    onSuccess: (steamAchievements) => {
      const steamNameMap: Record<string, string> = {}
      ACHIEVEMENTS.forEach((a) => {
        const key = (a.steamName || a.name).toLowerCase()
        steamNameMap[key] = a.id
      })

      let count = 0
      const next = { ...achievements.data }
      steamAchievements.forEach((sa) => {
        if (!sa.achieved) return
        const id = steamNameMap[sa.name.toLowerCase()]
        if (id && !next[id]) {
          next[id] = true
          count++
        }
      })

      if (count > 0) {
        achievements.setAll(next)
      }
      setImportCount(count)
      try { localStorage.setItem(STEAM_PROFILE_KEY, steamProfile) } catch { /* localStorage unavailable */ }
    },
  })

  const loaded = achievements.loaded && suits.loaded
  const isAchievements = activeTab === 'achievements'
  const completedCount = isAchievements ? Object.keys(achievements.data).length : Object.keys(suits.data).length
  const totalCount = isAchievements ? ACHIEVEMENTS.length : SUITS.length
  const pct = Math.round((completedCount / totalCount) * 100)

  if (!loaded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0f", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #222", borderTop: "3px solid #E23636", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#E23636", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2 }}>LOADING...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#E8E8E8", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        .ach-row { transition: background 0.15s, border-color 0.15s; }
        .ach-row:hover { background: #14141f !important; border-color: #2a2a3a !important; }
        .ach-row-done:hover { background: rgba(226,54,54,0.07) !important; }
        .cat-btn { transition: border-color 0.15s, color 0.15s; }
        .cat-btn:hover { border-color: #555 !important; color: #aaa !important; }
        .check-circle { transition: all 0.2s; }
        .check-circle:hover { transform: scale(1.15); filter: brightness(1.2); }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #0a0a0f 100%)", borderBottom: "2px solid #E23636", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 28px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 120, height: 120, background: "radial-gradient(circle at 0% 0%, rgba(226,54,54,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle at 100% 0%, rgba(226,54,54,0.08) 0%, transparent 70%)" }} />
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 8, color: "#888", marginBottom: -2 }}>MARVEL'S</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 10vw, 72px)", color: "#E23636", margin: 0, letterSpacing: 6, lineHeight: 1, textShadow: "0 0 40px rgba(226,54,54,0.3), 0 2px 0 #8B0000" }}>SPIDER-MAN</h1>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 5, color: "#666", marginTop: 4 }}>REMASTERED — {isAchievements ? "ACHIEVEMENT" : "SUIT"} TRACKER</div>
          </div>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 10 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#E23636", lineHeight: 1 }}>{completedCount}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#444" }}>/</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#666", lineHeight: 1 }}>{totalCount}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#E23636", marginLeft: 12, opacity: 0.8 }}>{pct}%</span>
              {(isAchievements ? achievements.saving : suits.saving) && <span style={{ fontSize: 10, color: "#E23636", background: "rgba(226,54,54,0.1)", padding: "2px 8px", borderRadius: 4, marginLeft: 12, fontWeight: 600, letterSpacing: 1 }}>SAVING...</span>}
            </div>
            <div style={{ width: "100%", height: 8, background: "#1a1a24", borderRadius: 4, overflow: "hidden", border: "1px solid #222" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #8B0000, #E23636, #FF4444)", borderRadius: 4, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden", width: `${pct}%` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)" }} />
              </div>
            </div>
            {isAchievements && pct === 100 && (
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, color: "#F5C518", textAlign: "center", marginTop: 14, textShadow: "0 0 20px rgba(245,197,24,0.4)", animation: "pulse 2s ease-in-out infinite" }}>
                {'\u{1F577}\u{FE0F}'} BE GREATER — PLATINUM UNLOCKED! {'\u{1F577}\u{FE0F}'}
              </div>
            )}
            {!isAchievements && pct === 100 && (
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, color: "#F5C518", textAlign: "center", marginTop: 14, textShadow: "0 0 20px rgba(245,197,24,0.4)", animation: "pulse 2s ease-in-out infinite" }}>
                {'\u{1F577}\u{FE0F}'} ALL SUITS COLLECTED! {'\u{1F577}\u{FE0F}'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TAB BAR */}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", borderBottom: "1px solid #1a1a24" }}>
        {([['achievements', `ACHIEVEMENTS (${Object.keys(achievements.data).length}/${ACHIEVEMENTS.length})`], ['suits', `SUITS (${Object.keys(suits.data).length}/${SUITS.length})`]] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "14px 0", background: "transparent", border: "none",
              borderBottom: activeTab === tab ? "3px solid #E23636" : "3px solid transparent",
              color: activeTab === tab ? "#E23636" : "#666",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
              cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
            }}
          >{label}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {isAchievements ? (
        <AchievementView
          completed={achievements.data}
          onToggle={achievements.toggle}
          onReset={achievements.reset}
          steamProfile={steamProfile}
          setSteamProfile={setSteamProfile}
          steamImport={steamImport}
          importCount={importCount}
        />
      ) : (
        <SuitView
          unlocked={suits.data}
          onToggle={suits.toggle}
          onReset={suits.reset}
        />
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a1a24", padding: "16px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#555", flexWrap: "wrap", gap: 8 }}>
          <span>{'\u{1F577}\u{FE0F}'} Progress saves automatically · Tap any row for details</span>
          <span style={{ opacity: 0.4 }}>{ACHIEVEMENTS.length} achievements · {SUITS.length} suits · Base game + City That Never Sleeps DLC</span>
        </div>
      </footer>
    </div>
  )
}
