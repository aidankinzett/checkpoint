import { createFileRoute } from '@tanstack/react-router'
import { getGame } from '~/games/registry'
import { GameTracker } from '~/components/game-tracker/game-tracker'

function GamePage() {
  const { gameId } = Route.useParams()
  const config = getGame(gameId)

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

export const Route = createFileRoute('/game-tracker/$gameId')({
  component: GamePage,
  ssr: false,
  head: ({ params }) => {
    const config = getGame(params.gameId)
    const fonts = config?.theme.fonts ?? []
    const fontFamilies = fonts.map((f) => `family=${f.replace(/ /g, '+')}`).join('&')
    return {
      meta: [{ title: config ? `${config.title} Tracker — Tools` : 'Game Tracker — Tools' }],
      links: fonts.length > 0
        ? [{ rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap` }]
        : [],
    }
  },
})
