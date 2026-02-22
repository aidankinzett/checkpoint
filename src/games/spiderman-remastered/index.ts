import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements, CATEGORIES } from './achievements'
import { suits, SUIT_CATEGORIES } from './suits'

const config: GameConfig = {
  id: 'spiderman-remastered',
  title: 'SPIDER-MAN',
  headerPrefix: "MARVEL'S",
  subtitle: 'REMASTERED',
  icon: '\u{1F577}\u{FE0F}',
  theme,
  steamAppId: 1817070,
  achievements,
  tierConfig,
  extras: [
    {
      type: 'suits',
      label: 'SUITS',
      items: suits,
    },
  ],
  completionMessage: '\u{1F577}\u{FE0F} BE GREATER \u2014 PLATINUM UNLOCKED! \u{1F577}\u{FE0F}',
}

export default config
export { CATEGORIES, SUIT_CATEGORIES }
