# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server (port 3000)
bun run build     # Production build to .output/
bun run lint      # ESLint (flat config)
bun run preview   # Preview production build
```

Bun is the package manager (bun.lock). Use `bun install` for dependencies.

## Architecture

Checkpoint is a game achievement tracker built with TanStack Start (React 19 + TypeScript) with SSR via Vite + Nitro. Deploys on Vercel.

**Routing:** TanStack Router with file-based routes in `src/routes/`. The route tree is auto-generated into `src/routeTree.gen.ts` (gitignored). All game routes use `ssr: false` because tracking state reads from localStorage.

**Two types of game pages:**
- `/$gameId` — curated games with hand-authored achievement data and guides
- `/steam/$appId` — dynamic tracker for any Steam game, pulling data live from the Steam API

**Game registry:** All curated games are registered in `src/games/registry.ts`. Each game lives in `src/games/{game-id}/` and exports a `GameConfig` object as its default from `index.ts`.

**Shared tracker UI:** `src/components/game-tracker/` — the `GameTracker` component is reused for both curated and dynamic Steam pages. It handles tab navigation (achievements + optional extras like suits), progress display, and Steam auto-import.

**Progress persistence:** `useTrackedMap` (`src/hooks/use-tracked-map.ts`) stores completion state in localStorage under keys like `game-tracker:{gameId}:achievements` and `game-tracker:{gameId}:{extraType}`.

**Auth:** `better-auth` with a custom Steam OpenID plugin (`src/server/steam-plugin.ts`). Auth routes handled at `/api/auth/$` via a catch-all server handler. Session stored in SQLite (`local.db` in dev, `DATABASE_PATH` env var in prod). Signing in with Steam stores `steamId`, `displayName`, and `avatarUrl` on the user.

**Server functions:** `createServerFn()` from `@tanstack/react-start`. Steam API calls live in `src/server/steam-games.ts` and `src/server/steam-achievements.ts`.

**Path aliases:** `~/*` maps to `./src/*`.

**Key files:**
- `src/games/types.ts` — `GameConfig`, `Achievement`, `TrackableExtra`, `GameTheme` types
- `src/games/registry.ts` — `getGame(id)` and `getAllGames()` lookups
- `src/routes/index.tsx` — Homepage with search across curated games + authenticated user's Steam library
- `src/routes/$gameId.tsx` — Curated game page with legacy localStorage migration logic
- `src/routes/steam/$appId.tsx` — Dynamic Steam game page; tiers assigned from global achievement percentages
- `src/server/auth.ts` — `better-auth` instance + `Session` type export
- `src/hooks/use-session.ts` — `authClient` and `useSession()` re-exports

## Adding a Curated Game

Three files needed:

### 1. `src/games/{game-id}/theme.ts`
```ts
import type { GameTheme, TierConfig } from '../types'
export const theme: GameTheme = { accent: '#E23636', fonts: ['Bebas Neue', 'Barlow'] }
export const tierConfig: Record<string, TierConfig> = {
  gold:   { label: 'Gold',   color: '#F5C518', icon: '🏆' },
  silver: { label: 'Silver', color: '#A8B4C0', icon: '🥈' },
  bronze: { label: 'Bronze', color: '#CD7F32', icon: '🥉' },
}
```

### 2. `src/games/{game-id}/achievements.ts`
Array of `Achievement` objects. Each achievement requires `id`, `name`, `desc`, `tier`, `category`, `guide`. Set `steamName` when the Steam API name differs from `name` (used for auto-sync matching).

### 3. `src/games/{game-id}/index.ts`
```ts
import type { GameConfig } from '../types'
import { theme, tierConfig } from './theme'
import { achievements } from './achievements'

const config: GameConfig = {
  id: 'my-game',
  title: 'MY GAME',
  icon: '🎮',
  theme,
  steamAppId: 12345,   // optional; enables Steam auto-sync
  achievements,
  tierConfig,
  extras: [],          // optional: suits, collectibles, etc.
  completionMessage: '🏆 Platinum unlocked!',
}
export default config
```

Then register it in `src/games/registry.ts`.

## Environment Variables

```
BETTER_AUTH_SECRET=    # random secret for session signing
BETTER_AUTH_URL=       # full origin, e.g. https://checkpoint.example.com
STEAM_API_KEY=         # Steam Web API key
DATABASE_PATH=         # path to SQLite file (default: ./local.db)
```

## Styling

Tailwind CSS v4 via Vite plugin. CSS entry point is `src/styles/app.css`. Dark theme throughout (`#0a0a0f` background, `#E8E8E8` text). Components use inline styles with occasional Tailwind classes. Game-specific accent colors come from `GameTheme.accent`.
