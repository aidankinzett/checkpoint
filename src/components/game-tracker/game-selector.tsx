import { Link } from '@tanstack/react-router'
import { getAllGames } from '~/games/registry'

export function GameSelector() {
  const games = getAllGames()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
      >
        &larr; Back to Tools
      </Link>

      <h1 className="text-3xl font-bold mb-2">Game Tracker</h1>
      <p className="text-zinc-400 mb-8">
        Select a game to track your progress.
      </p>

      {games.length === 0 ? (
        <p className="text-zinc-500">
          No games registered yet. Add a game config to{' '}
          <code className="text-zinc-300">src/games/</code> to get started.
        </p>
      ) : (
        <div className="grid gap-3 max-w-md">
          {games.map((game) => (
            <Link
              key={game.id}
              to="/game-tracker/$gameId"
              params={{ gameId: game.id }}
              className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-transparent"
              style={{
                borderColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = game.theme.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              <span className="text-2xl shrink-0">{game.icon}</span>
              <div>
                <div className="font-medium">{game.title}</div>
                {game.subtitle && (
                  <div className="text-sm text-zinc-400">{game.subtitle}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
