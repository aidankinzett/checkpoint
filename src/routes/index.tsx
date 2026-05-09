import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllGames } from '~/games/registry'

export const Route = createFileRoute('/')({
  component: Home,
  ssr: false,
  head: () => ({
    meta: [{ title: 'Checkpoint' }],
  }),
})

function Home() {
  const games = getAllGames()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold mb-1">Checkpoint</h1>
        <p className="text-zinc-400 mb-8">Track your achievements across every game.</p>

        <div className="grid gap-3">
          {games.map((game) => (
            <Link
              key={game.id}
              to="/$gameId"
              params={{ gameId: game.id }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-transparent"
              style={{ borderColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = game.theme.accent }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent' }}
            >
              <span className="text-2xl shrink-0">{game.icon}</span>
              <div>
                <div className="font-medium">
                  {game.headerPrefix ? `${game.headerPrefix} ` : ''}{game.title}{game.subtitle ? ` ${game.subtitle}` : ''}
                </div>
                <div className="text-sm text-zinc-400">{game.achievements.length} achievements</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
