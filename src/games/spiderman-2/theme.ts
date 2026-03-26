import type { GameTheme, TierConfig } from '../types'

export const theme: GameTheme = {
  accent: '#E11D48',
  accentSecondary: '#7C3AED',
  background: '#0a0a0f',
  fonts: ['Bebas Neue', 'Barlow:wght@400;500;600;700'],
}

export const tierConfig: Record<string, TierConfig> = {
  gold: { label: 'Gold', color: '#F5C518', icon: '\u{1F3C6}' },
  silver: { label: 'Silver', color: '#A8B4C0', icon: '\u{1F948}' },
  bronze: { label: 'Bronze', color: '#CD7F32', icon: '\u{1F949}' },
}
