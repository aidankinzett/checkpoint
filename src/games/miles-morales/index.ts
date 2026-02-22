import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements, CATEGORIES } from './achievements'
import { suits, SUIT_CATEGORIES } from './suits'

const config: GameConfig = {
  id: 'miles-morales',
  title: 'SPIDER-MAN',
  headerPrefix: "MARVEL'S",
  subtitle: 'MILES MORALES',
  icon: '\u{1F577}\u{FE0F}',
  theme,
  steamAppId: 1817190,
  achievements,
  tierConfig,
  extras: [
    {
      type: 'suits',
      label: 'SUITS',
      items: suits,
    },
  ],
  completionMessage: '\u{26A1} BE YOURSELF \u2014 PLATINUM UNLOCKED! \u{26A1}',
}

export default config
export { CATEGORIES, SUIT_CATEGORIES }
