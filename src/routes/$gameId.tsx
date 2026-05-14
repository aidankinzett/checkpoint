import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getGame } from '~/games/registry'
import { GameTracker } from '~/components/game-tracker/game-tracker'
import { useSession } from '~/hooks/use-session'
import { fetchGameLogo } from '~/server/steam-games'

function migrateSpidermanData() {
  const migrationKey = 'game-tracker:migration:spiderman-v1'
  try {
    if (localStorage.getItem(migrationKey)) return
    const migrations = [
      ['spiderman-achievements', 'game-tracker:spiderman-remastered:achievements'],
      ['spiderman-suits', 'game-tracker:spiderman-remastered:suits'],
      ['spiderman-steam-profile', 'game-tracker:spiderman-remastered:steam-profile'],
    ] as const
    const updates = []
    for (let i = 0; i < migrations.length; i++) {
      const [oldKey, newKey] = migrations[i]
      const value = localStorage.getItem(oldKey)
      if (value && !localStorage.getItem(newKey)) {
        updates.push({ oldKey, newKey, value })
      }
    }

    for (let i = 0; i < updates.length; i++) {
      const { oldKey, newKey, value } = updates[i]
      localStorage.setItem(newKey, value)
      localStorage.removeItem(oldKey)
    }
    localStorage.setItem(migrationKey, '1')
  } catch { /* localStorage unavailable */ }
}

function GamePage() {
  const { gameId } = Route.useParams()
  const config = getGame(gameId)
  const { data: session } = useSession()
  const steamId = (session?.user as { steamId?: string } | undefined)?.steamId

  useState(() => {
    if (gameId === 'spiderman-remastered') {
      migrateSpidermanData()
    }
  })

  const logoQuery = useQuery({
    queryKey: ['steamgriddb-logo', String(config?.steamAppId)],
    queryFn: () => fetchGameLogo({ data: { appId: String(config!.steamAppId) } }),
    enabled: !!config?.steamAppId,
    staleTime: 1000 * 60 * 60 * 24,
  })

  if (!config) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#E8E8E8] flex flex-col items-center justify-center font-['Barlow',sans-serif]">
        <h1 className="text-[48px] font-['Bebas_Neue',sans-serif] text-[#E23636] mb-2">Game Not Found</h1>
        <p className="text-[#888]">No tracker exists for this game.</p>
      </div>
    )
  }

  const configWithLogo = logoQuery.data
    ? { ...config, logoUrl: logoQuery.data }
    : config

  return <GameTracker config={configWithLogo} steamId={steamId} />
}

export const Route = createFileRoute('/$gameId')({
  component: GamePage,
  ssr: false,
  head: ({ params }) => {
    const config = getGame(params.gameId)
    const fonts = config?.theme.fonts ?? []
    const fontFamilies = fonts.map((f) => `family=${f.replace(/ /g, '+')}`).join('&')
    return {
      meta: [{ title: config ? `${config.title} — Checkpoint` : 'Checkpoint' }],
      links: fonts.length > 0
        ? [{ rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap` }]
        : [],
    }
  },
})
