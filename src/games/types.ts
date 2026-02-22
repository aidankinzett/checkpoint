export interface GameTheme {
  accent: string
  accentSecondary?: string
  background?: string
  fonts: string[]
}

export interface TierConfig {
  label: string
  color: string
  icon: string
}

export interface Achievement {
  id: string
  name: string
  desc: string
  tier: 'gold' | 'silver' | 'bronze'
  category: string
  secret?: boolean
  guide: string
  steamName?: string
}

export interface TrackableItem {
  id: string
  name: string
  category: string
  description?: string
  details?: Record<string, string>
}

export interface TrackableExtra {
  type: string
  label: string
  items: TrackableItem[]
}

export interface GameConfig {
  id: string
  title: string
  subtitle?: string
  icon: string
  theme: GameTheme
  steamAppId?: number
  achievements: Achievement[]
  tierConfig: Record<string, TierConfig>
  extras?: TrackableExtra[]
  completionMessage?: string
}
