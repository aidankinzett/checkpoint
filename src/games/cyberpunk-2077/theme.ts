import type { GameTheme, TierConfig } from '../types'

export const theme: GameTheme = {
  accent: '#F5E642',
  accentSecondary: '#00B4D8',
  background: '#0a0a0f',
  fonts: ['Rajdhani:wght@500;600;700', 'Barlow:wght@400;500;600;700'],
}

export const tierConfig: Record<string, TierConfig> = {
  gold: { label: 'Gold', color: '#F5C518', icon: '🏆' },
  silver: { label: 'Silver', color: '#A8B4C0', icon: '🥈' },
  bronze: { label: 'Bronze', color: '#CD7F32', icon: '🥉' },
}
