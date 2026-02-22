import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { emojiToFavicon, setFavicon } from '~/lib/favicon'
import { fetchSteamAchievements } from '~/server/steam-achievements'
import { useTrackedMap } from '~/hooks/use-tracked-map'
import type { GameConfig } from '~/games/types'
import { ProgressHeader } from './progress-header'
import { AchievementView } from './achievement-view'
import { TrackableView } from './trackable-view'

interface GameTrackerProps {
  config: GameConfig
}

export function GameTracker({ config }: GameTrackerProps) {
  const firstExtra = config.extras?.[0]

  // Tab state: 'achievements' or the extra's type string (e.g. 'suits')
  const [activeTab, setActiveTab] = useState<string>('achievements')

  // Achievement tracking
  const achievements = useTrackedMap(`game-tracker:${config.id}:achievements`)

  // Extra tracking — always call the hook to satisfy rules of hooks.
  // Uses a dummy key when no extras exist.
  const extraTracker = useTrackedMap(
    firstExtra ? `game-tracker:${config.id}:${firstExtra.type}` : `game-tracker:${config.id}:_unused`
  )

  // Steam profile state
  const [steamProfile, setSteamProfile] = useState(() => {
    try { return localStorage.getItem(`game-tracker:${config.id}:steam-profile`) || "" } catch { return "" }
  })
  const [importCount, setImportCount] = useState<number | null>(null)

  // Steam import mutation
  const steamImport = useMutation({
    mutationFn: async (profile: string) => {
      return fetchSteamAchievements({ data: { profile, appId: String(config.steamAppId) } })
    },
    onSuccess: (steamAchievements) => {
      const steamNameMap: Record<string, string> = {}
      config.achievements.forEach((a) => {
        const key = (a.steamName || a.name).toLowerCase()
        steamNameMap[key] = a.id
      })

      let count = 0
      const next = { ...achievements.data }
      steamAchievements.forEach((sa: { name: string; achieved: boolean }) => {
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
      try { localStorage.setItem(`game-tracker:${config.id}:steam-profile`, steamProfile) } catch { /* localStorage unavailable */ }
    },
  })

  // Favicon: set on mount, restore default on unmount
  useEffect(() => {
    const href = emojiToFavicon(config.icon)
    setFavicon(href)
    return () => {
      setFavicon("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>\u{1F6E0}\u{FE0F}</text></svg>")
    }
  }, [config.icon])

  // Derived data
  const isAchievements = activeTab === 'achievements'
  const achievementCategories = [...new Set(config.achievements.map(a => a.category))]
  const extraCategories = firstExtra ? [...new Set(firstExtra.items.map(item => item.category))] : []

  // Progress counts for the active tab
  const completedCount = isAchievements
    ? Object.keys(achievements.data).length
    : (firstExtra ? Object.keys(extraTracker.data).length : 0)
  const totalCount = isAchievements
    ? config.achievements.length
    : (firstExtra ? firstExtra.items.length : 0)

  // Saving state for the active tab
  const saving = isAchievements ? achievements.saving : extraTracker.saving

  // Loading state
  const loaded = achievements.loaded && extraTracker.loaded
  if (!loaded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0f", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #222", borderTop: `3px solid ${config.theme.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: config.theme.accent, fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2 }}>LOADING...</p>
      </div>
    )
  }

  // Tracking label for ProgressHeader
  const tabLabel = isAchievements ? "ACHIEVEMENT TRACKER" : `${(firstExtra?.label ?? activeTab).toUpperCase()} TRACKER`
  const trackingLabel = config.subtitle
    ? `${config.subtitle.toUpperCase()} \u2014 ${tabLabel}`
    : tabLabel

  // Completion message for the active tab
  const completionMessage = isAchievements ? config.completionMessage : undefined

  // Build tab definitions
  const tabs: { key: string; label: string }[] = [
    { key: 'achievements', label: `ACHIEVEMENTS (${Object.keys(achievements.data).length}/${config.achievements.length})` },
  ]
  if (firstExtra) {
    tabs.push({
      key: firstExtra.type,
      label: `${firstExtra.label.toUpperCase()} (${Object.keys(extraTracker.data).length}/${firstExtra.items.length})`,
    })
  }

  // Footer info parts
  const footerParts: string[] = [`${config.achievements.length} achievements`]
  if (firstExtra) {
    footerParts.push(`${firstExtra.items.length} ${firstExtra.label.toLowerCase()}`)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#E8E8E8", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        .ach-row { transition: background 0.15s, border-color 0.15s; }
        .ach-row:hover { background: #14141f !important; border-color: #2a2a3a !important; }
        .ach-row-done:hover { background: ${hexToRgba(config.theme.accent, 0.07)} !important; }
        .cat-btn { transition: border-color 0.15s, color 0.15s; }
        .cat-btn:hover { border-color: #555 !important; color: #aaa !important; }
        .check-circle { transition: all 0.2s; }
        .check-circle:hover { transform: scale(1.15); filter: brightness(1.2); }
      `}</style>

      {/* HEADER */}
      <ProgressHeader
        title={config.title}
        subtitle={config.headerPrefix}
        trackingLabel={trackingLabel}
        accent={config.theme.accent}
        accentSecondary={config.theme.accentSecondary}
        completedCount={completedCount}
        totalCount={totalCount}
        saving={saving}
        completionMessage={completionMessage}
      />

      {/* TAB BAR */}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", borderBottom: "1px solid #1a1a24" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "14px 0", background: "transparent", border: "none",
              borderBottom: activeTab === tab.key ? `3px solid ${config.theme.accent}` : "3px solid transparent",
              color: activeTab === tab.key ? config.theme.accent : "#666",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
              cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {isAchievements ? (
        <AchievementView
          achievements={config.achievements}
          categories={achievementCategories}
          tierConfig={config.tierConfig}
          accent={config.theme.accent}
          completed={achievements.data}
          onToggle={achievements.toggle}
          onReset={achievements.reset}
          steamAppId={config.steamAppId}
          steamProfile={steamProfile}
          setSteamProfile={setSteamProfile}
          steamImport={steamImport}
          importCount={importCount}
        />
      ) : firstExtra ? (
        <TrackableView
          items={firstExtra.items}
          categories={extraCategories}
          accent={config.theme.accent}
          completed={extraTracker.data}
          onToggle={extraTracker.toggle}
          onReset={extraTracker.reset}
          itemLabel={firstExtra.type}
          completedLabel="completed"
        />
      ) : null}

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a1a24", padding: "16px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#555", flexWrap: "wrap", gap: 8 }}>
          <span>{config.icon} Progress saves automatically · Tap any row for details</span>
          <span style={{ opacity: 0.4 }}>{footerParts.join(' · ')}</span>
        </div>
      </footer>
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
