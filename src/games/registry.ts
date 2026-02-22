import type { GameConfig } from './types'
import spidermanRemastered from './spiderman-remastered'

const games: GameConfig[] = [
  spidermanRemastered,
]

export function getGame(id: string): GameConfig | undefined {
  return games.find((g) => g.id === id)
}

export function getAllGames(): GameConfig[] {
  return games
}
