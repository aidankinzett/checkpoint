import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { GameTracker } from '~/components/game-tracker/game-tracker'
import { fetchGameSchema, fetchGlobalAchievementRatings, fetchGameLogo } from '~/server/steam-games'
import { gameSchemaCollection } from '~/lib/db'
import { fetchSteamAchievements } from '~/server/steam-achievements'
import type { GameConfig, Achievement } from '~/games/types'
import { useSession } from '~/hooks/use-session'

const DEFAULT_THEME = { accent: '#4a9eff', background: '#0a0a0f', fonts: [] }
const DEFAULT_TIER_CONFIG = {
  gold: { label: 'Rare', color: '#F5C518', icon: '🏆' },
  silver: { label: 'Uncommon', color: '#A8B4C0', icon: '🥈' },
  bronze: { label: 'Common', color: '#CD7F32', icon: '🥉' },
}

function assignTier(percent: number): 'gold' | 'silver' | 'bronze' {
  if (percent < 5) return 'gold'
  if (percent < 25) return 'silver'
  return 'bronze'
}

function SteamGamePage() {
  const { appId } = Route.useParams()
  const { data: session } = useSession()
  const steamId = session?.user.steamId

  const [gameTitle] = useState<string>(() => {
    try { return localStorage.getItem(`steam-game-name:${appId}`) || `App ${appId}` } catch { return `App ${appId}` }
  })

  const combinedQuery = useQuery({
    queryKey: ['steam-combined-schema', appId],
    queryFn: async () => {
      const cached = gameSchemaCollection.find(appId)
      const now = Date.now()
      const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

      if (cached && (now - cached.timestamp < ONE_WEEK)) {
        return cached
      }

      const achievements = await fetchGameSchema({ data: { appId } })

      let ratings: { name: string, percent: number }[] = []
      try {
        ratings = await fetchGlobalAchievementRatings({ data: { appId } })
      } catch (err) {
        console.warn('Failed to fetch ratings:', err)
      }

      const newCache = {
        appId,
        timestamp: now,
        achievements,
        ratings,
      }

      if (cached) {
        gameSchemaCollection.update(appId, newCache)
      } else {
        gameSchemaCollection.insert(newCache)
      }

      return newCache
    },
    staleTime: 1000 * 60 * 60 * 24 * 7,
  })

  const logoQuery = useQuery({
    queryKey: ['steamgriddb-logo', appId],
    queryFn: () => fetchGameLogo({ data: { appId } }),
    staleTime: 1000 * 60 * 60 * 24,
  })

  const userAchievementsQuery = useQuery({
    queryKey: ['steam-user-achievements', appId, steamId],
    queryFn: () => fetchSteamAchievements({ data: { appId } }),
    enabled: !!steamId,
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = combinedQuery.isLoading
  const error = combinedQuery.error

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0f] gap-4">
        <div className="w-10 h-10 border-[3px] border-[#222] border-t-[#4a9eff] rounded-full animate-spin" />
        <p className="text-[#4a9eff] font-sans text-[18px]">Loading achievements…</p>
      </div>
    )
  }

  if (error || !combinedQuery.data?.achievements?.length) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#E8E8E8] flex flex-col items-center justify-center gap-3">
        <p className="text-[48px]">😕</p>
        <h1 className="text-[24px] text-[#4a9eff]">No Achievements Found</h1>
        <p className="text-[#888]">This game either has no achievements or its data is not public.</p>
        <Link to="/" className="text-[#4a9eff] mt-2 hover:underline">← Back to search</Link>
      </div>
    )
  }

  const ratingMap = new Map(
    (combinedQuery.data?.ratings ?? []).map(r => [r.name.toLowerCase(), r.percent])
  )

  const userAchievedSet = new Set(
    (userAchievementsQuery.data ?? [])
      .filter(a => a.achieved)
      .map(a => a.name.toLowerCase())
  )

  const achievements: Achievement[] = (combinedQuery.data?.achievements ?? []).map(a => ({
    id: a.name,
    name: a.displayName || a.name,
    desc: a.description || '',
    tier: assignTier(ratingMap.get(a.name.toLowerCase()) ?? 100),
    category: 'Achievements',
    secret: a.hidden === 1,
    guide: a.description || '',
    steamName: a.name,
  }))

  const config: GameConfig = {
    id: `steam-${appId}`,
    title: gameTitle,
    icon: '🎮',
    logoUrl: logoQuery.data ?? undefined,
    theme: DEFAULT_THEME,
    steamAppId: Number(appId),
    achievements,
    tierConfig: DEFAULT_TIER_CONFIG,
  }

  return (
    <GameTracker
      config={config}
      steamId={steamId}
      preloadedAchievements={userAchievedSet.size > 0 ? Object.fromEntries([...userAchievedSet].map(name => {
        const ach = achievements.find(a => a.steamName?.toLowerCase() === name)
        return ach ? [ach.id, true] : [name, true]
      })) : undefined}
    />
  )
}

export const Route = createFileRoute('/steam/$appId')({
  component: SteamGamePage,
  ssr: false,
  head: ({ params }) => ({
    meta: [{ title: `Steam ${params.appId} — Checkpoint` }],
  }),
})
