import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements, CATEGORIES } from './achievements'

const config: GameConfig = {
  id: 'forza-horizon-5',
  title: 'FORZA HORIZON',
  subtitle: '5',
  icon: '\u{1F3CE}\u{FE0F}',
  theme,
  steamAppId: 1551360,
  achievements,
  tierConfig,
  completionMessage: '\u{1F3CE}\u{FE0F} HALL OF FAME \u2014 ALL ACHIEVEMENTS UNLOCKED! \u{1F3CE}\u{FE0F}',
}

export default config
export { CATEGORIES }
