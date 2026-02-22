import type { GameConfig } from './types'
import spidermanRemastered from './spiderman-remastered'
import milesMoreales from './miles-morales'

const games: GameConfig[] = [
  spidermanRemastered,
  milesMoreales,
]

export function getGame(id: string): GameConfig | undefined {
  return games.find((g) => g.id === id)
}

export function getAllGames(): GameConfig[] {
  return games
}
