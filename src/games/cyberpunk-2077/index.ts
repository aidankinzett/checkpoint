import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements, CATEGORIES } from './achievements'

const config: GameConfig = {
  id: 'cyberpunk-2077',
  title: 'CYBERPUNK 2077',
  subtitle: 'NIGHT CITY',
  icon: '🌃',
  theme,
  steamAppId: 1091500,
  achievements,
  tierConfig,
  completionMessage: '🌃 THE LEGEND OF NIGHT CITY — ALL ACHIEVEMENTS UNLOCKED! 🌃',
}

export default config
export { CATEGORIES }
