import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { GameTracker } from '~/components/game-tracker/game-tracker'
import { fetchGameSchema, fetchGlobalAchievementRatings, fetchGameLogo } from '~/server/steam-games'
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
  const steamId = (session?.user as { steamId?: string } | undefined)?.steamId

  const [gameTitle] = useState<string>(() => {
    try { return localStorage.getItem(`steam-game-name:${appId}`) || `App ${appId}` } catch { return `App ${appId}` }
  })

  const schemaQuery = useQuery({
    queryKey: ['steam-schema', appId],
    queryFn: () => fetchGameSchema({ data: { appId } }),
    staleTime: 1000 * 60 * 60,
  })

  const ratingsQuery = useQuery({
    queryKey: ['steam-ratings', appId],
    queryFn: () => fetchGlobalAchievementRatings({ data: { appId } }),
    staleTime: 1000 * 60 * 60,
  })

  const logoQuery = useQuery({
    queryKey: ['steamgriddb-logo', appId],
    queryFn: () => fetchGameLogo({ data: { appId } }),
    staleTime: 1000 * 60 * 60 * 24,
  })

  const userAchievementsQuery = useQuery({
    queryKey: ['steam-user-achievements', appId, steamId],
    queryFn: () => fetchSteamAchievements({ data: { profile: steamId!, appId } }),
    enabled: !!steamId,
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = schemaQuery.isLoading || ratingsQuery.isLoading
  const error = schemaQuery.error

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #222', borderTop: '3px solid #4a9eff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#4a9eff', fontFamily: 'sans-serif', fontSize: 18 }}>Loading achievements…</p>
      </div>
    )
  }

  if (error || !schemaQuery.data?.length) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#E8E8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <p style={{ fontSize: 48 }}>😕</p>
        <h1 style={{ fontSize: 24, color: '#4a9eff' }}>No Achievements Found</h1>
        <p style={{ color: '#888' }}>This game either has no achievements or its data is not public.</p>
        <Link to="/" style={{ color: '#4a9eff', marginTop: 8 }}>← Back to search</Link>
      </div>
    )
  }

  const ratingMap = new Map(
    (ratingsQuery.data ?? []).map(r => [r.name.toLowerCase(), r.percent])
  )

  const userAchievedSet = new Set(
    (userAchievementsQuery.data ?? [])
      .filter(a => a.achieved)
      .map(a => a.name.toLowerCase())
  )

  const achievements: Achievement[] = schemaQuery.data.map(a => ({
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
