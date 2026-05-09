import type { GameConfig } from './types'
import spidermanRemastered from './spiderman-remastered'
import milesMoreales from './miles-morales'
import spiderman2 from './spiderman-2'
import forzaHorizon5 from './forza-horizon-5'
import cyberpunk2077 from './cyberpunk-2077'

const games: GameConfig[] = [
  spidermanRemastered,
  milesMoreales,
  spiderman2,
  forzaHorizon5,
  cyberpunk2077,
]

export function getGame(id: string): GameConfig | undefined {
  return games.find((g) => g.id === id)
}

export function getAllGames(): GameConfig[] {
  return games
}
