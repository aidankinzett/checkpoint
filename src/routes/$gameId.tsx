import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getGame } from '~/games/registry'
import { GameTracker } from '~/components/game-tracker/game-tracker'

function migrateSpidermanData() {
  const migrationKey = 'game-tracker:migration:spiderman-v1'
  try {
    if (localStorage.getItem(migrationKey)) return
    const migrations = [
      ['spiderman-achievements', 'game-tracker:spiderman-remastered:achievements'],
      ['spiderman-suits', 'game-tracker:spiderman-remastered:suits'],
      ['spiderman-steam-profile', 'game-tracker:spiderman-remastered:steam-profile'],
    ] as const
    for (const [oldKey, newKey] of migrations) {
      const value = localStorage.getItem(oldKey)
      if (value && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, value)
        localStorage.removeItem(oldKey)
      }
    }
    localStorage.setItem(migrationKey, '1')
  } catch { /* localStorage unavailable */ }
}

function GamePage() {
  const { gameId } = Route.useParams()
  const config = getGame(gameId)

  useState(() => {
    if (gameId === 'spiderman-remastered') {
      migrateSpidermanData()
    }
  })

  if (!config) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#E8E8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif" }}>
        <h1 style={{ fontSize: 48, fontFamily: "'Bebas Neue', sans-serif", color: '#E23636', marginBottom: 8 }}>Game Not Found</h1>
        <p style={{ color: '#888' }}>No tracker exists for this game.</p>
      </div>
    )
  }

  return <GameTracker config={config} />
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
