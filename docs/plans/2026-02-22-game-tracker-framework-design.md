# Game Tracker Framework Design

## Problem

The Spider-Man Remastered achievement tracker is a standalone tool with game-specific data, components, and styling hardcoded together. We want to support multiple games (starting with Spider-Man: Miles Morales) without duplicating code.

## Decisions

- **Architecture:** Game Module Pattern — each game is a directory with standardized exports
- **Item types:** Achievements always present, optional extras (suits, collectibles, etc.) per game
- **Theming:** Per-game color schemes and fonts via CSS custom properties
- **Routing:** Nested routes under `/game-tracker` with a game selector index page
- **Homepage:** Single "Game Tracker" tile, game picker inside
- **Steam import:** Shared server function + UI, each game provides its App ID
- **Miles Morales data:** User will provide; skeleton module created with placeholders

## Directory Structure

```
src/
├── games/
│   ├── types.ts                          # Shared interfaces
│   ├── registry.ts                       # Game registry
│   ├── spiderman-remastered/
│   │   ├── index.ts                      # Exports GameConfig
│   │   ├── achievements.ts
│   │   ├── suits.ts
│   │   └── theme.ts
│   └── miles-morales/
│       ├── index.ts
│       ├── achievements.ts
│       ├── suits.ts
│       └── theme.ts
├── components/game-tracker/
│   ├── game-tracker.tsx                  # Main wrapper (tabs, progress, theme)
│   ├── game-selector.tsx                 # Game picker page
│   ├── achievement-view.tsx              # Generic achievement list
│   ├── trackable-view.tsx               # Generic list for extras
│   ├── steam-import-panel.tsx            # Generic Steam import UI
│   ├── progress-header.tsx               # Progress bar + completion %
│   └── filter-bar.tsx                    # Category/tier/search filters
├── hooks/
│   └── use-tracked-map.ts               # localStorage-backed tracking hook
├── server/
│   └── steam-achievements.ts            # Generic: accepts appId parameter
├── routes/
│   ├── game-tracker/
│   │   ├── index.tsx                     # Game selector page
│   │   └── $gameId.tsx                   # Dynamic route renders any game
└── tools/
    └── game-tracker.tsx                  # Tool meta for homepage discovery
```

## Type System

```ts
interface GameTheme {
  accent: string
  accentSecondary?: string
  background?: string         // Defaults to #0a0a0f
  fonts: string[]             // Google Fonts to load
}

interface TierConfig {
  label: string
  color: string
  icon: string
}

interface Achievement {
  id: string
  name: string
  desc: string
  tier: 'gold' | 'silver' | 'bronze'
  category: string
  secret?: boolean
  guide: string
  steamName?: string
}

interface TrackableItem {
  id: string
  name: string
  category: string
  description?: string
  details?: Record<string, string>
}

interface TrackableExtra {
  type: string                // e.g. 'suits'
  label: string               // Tab label
  items: TrackableItem[]
}

interface GameConfig {
  id: string                  // URL slug
  title: string
  theme: GameTheme
  steamAppId?: number
  achievements: Achievement[]
  tierConfig: Record<string, TierConfig>
  extras?: TrackableExtra[]
}
```

## Routing

- `/game-tracker` — Game selector grid showing all registered games with progress
- `/game-tracker/$gameId` — Dynamic route that loads game config by ID, renders tracker
- Both routes use `ssr: false` (localStorage dependency)
- Game-specific Google Fonts loaded via route `head.links`

## Generic Components

**GameTracker** — Main wrapper: applies theme, shows progress header, renders tabs (achievements + extras). Theme applied via CSS custom properties.

**ProgressHeader** — Game title, total completion count/percentage, animated progress bar using theme accent color. Completion celebration at 100%.

**AchievementView** — Renders achievement list with filtering by category, tier, search, completion status, and story toggle. Expandable rows with guide text. Steam import button when steamAppId is configured.

**TrackableView** — Renders any extra type (suits, collectibles). Category filter, search, completion toggle. Expandable rows rendering `details` as key-value pairs.

**SteamImportPanel** — Generic Steam import UI. Receives steamAppId and achievement list as props. Same UX as current implementation.

**FilterBar** — Reusable filter controls: category pills, search input, toggle switches. Configured via props.

## Steam Import

Server function `fetchSteamAchievements` becomes generic — accepts `appId` as a parameter alongside `profile`. Each game provides its Steam App ID in the config. The matching logic (steamName fallback, case-insensitive) stays the same.

## Storage

localStorage keys namespaced per game:
- `game-tracker:{gameId}:achievements`
- `game-tracker:{gameId}:{extraType}` (e.g. `game-tracker:spiderman-remastered:suits`)
- `game-tracker:{gameId}:steam-profile`

One-time migration reads old keys (`spiderman-achievements`, `spiderman-suits`, `spiderman-steam-profile`), writes to new namespaced keys, deletes old keys.

## Miles Morales

- Steam App ID: 1338130
- Theme: dark red/black with bio-electric purple/yellow accents
- Fonts: same Bebas Neue + Barlow (can be customized later)
- Data: user will provide achievement and suit lists; skeleton module created with placeholders
