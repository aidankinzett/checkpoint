import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements, CATEGORIES } from './achievements'
import { suits, SUIT_CATEGORIES } from './suits'

const config: GameConfig = {
  id: 'spiderman-2',
  title: 'SPIDER-MAN',
  headerPrefix: "MARVEL'S",
  subtitle: '2',
  icon: '\u{1F578}\u{FE0F}',
  theme,
  steamAppId: 2651280,
  achievements,
  tierConfig,
  extras: [
    {
      type: 'suits',
      label: 'SUITS',
      items: suits,
    },
  ],
  completionMessage: '\u{1F578}\u{FE0F} WITH GREAT POWER \u2014 PLATINUM UNLOCKED! \u{1F578}\u{FE0F}',
}

export default config
export { CATEGORIES, SUIT_CATEGORIES }
