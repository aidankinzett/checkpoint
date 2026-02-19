export interface TierConfig {
  label: string
  color: string
  icon: string
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  gold: { label: "Gold", color: "#F5C518", icon: "\u{1F3C6}" },
  silver: { label: "Silver", color: "#A8B4C0", icon: "\u{1F948}" },
  bronze: { label: "Bronze", color: "#CD7F32", icon: "\u{1F949}" },
}

export const STORAGE_KEY = "spiderman-achievements"
export const SUITS_STORAGE_KEY = "spiderman-suits"
export const STEAM_PROFILE_KEY = "spiderman-steam-profile"
