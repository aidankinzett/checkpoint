import { createFileRoute } from '@tanstack/react-router'
import { GameSelector } from '~/components/game-tracker/game-selector'

export const Route = createFileRoute('/game-tracker/')({
  component: GameSelector,
  head: () => ({
    meta: [{ title: 'Game Tracker — Tools' }],
  }),
})
