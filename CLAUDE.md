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

A TanStack Start (React 19 + TypeScript) SSR app serving a collection of standalone tools. Uses Vite, file-based routing via TanStack Router, and deploys on Vercel via Nitro.

**Routing:** TanStack Router with file-based routes in `src/routes/`. The route tree is auto-generated into `src/routeTree.gen.ts` (gitignored).

**Tool discovery:** The homepage (`src/routes/index.tsx`) uses `import.meta.glob('../tools/*.tsx', { eager: true })` to discover tool meta at build time. Each tool also needs a thin route file in `src/routes/`.

**Server functions:** `createServerFn()` from `@tanstack/react-start` replaces Vercel serverless functions. Server code lives in `src/server/`.

**Path aliases:** `~/*` maps to `./src/*` (configured in tsconfig.json + vite-tsconfig-paths).

**Key files:**
- `src/router.tsx` — Router config with QueryClient in context
- `src/routes/__root.tsx` — HTML shell, Tailwind CSS, QueryClientProvider
- `src/routes/index.tsx` — Homepage grid with tool discovery
- `src/lib/favicon.ts` — Dynamic emoji favicon utilities

## Adding a New Tool

Two files are needed per tool:

### 1. Tool component (`src/tools/my-tool.tsx`)

```tsx
export const meta = {
  title: "My Tool",
  description: "What it does",
  icon: "🔧",  // emoji or data URI
};

export default function MyTool() {
  return <div>...</div>;
}
```

### 2. Route file (`src/routes/my-tool.tsx`)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import MyTool from '~/tools/my-tool'

export const Route = createFileRoute('/my-tool')({
  component: MyTool,
  head: () => ({
    meta: [{ title: 'My Tool — Tools' }],
  }),
})
```

The tool auto-appears on the homepage grid. Use `ssr: false` on the route if the tool uses browser-only APIs like localStorage.

## Styling

Tailwind CSS v4 via Vite plugin. CSS entry point is `src/styles/app.css`. Dark theme throughout (zinc-950 background). The existing tool (spiderman-tracker) uses a mix of Tailwind classes and inline styles.
