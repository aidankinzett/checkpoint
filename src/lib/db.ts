import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'
import { z } from 'zod'

export const trackedItemSchema = z.object({
  id: z.string(), // "storageKey:itemId" e.g., "game-tracker:1817070:achievements:ACH_WIN"
  storageKey: z.string(), // "game-tracker:1817070:achievements"
  itemId: z.string(), // "ACH_WIN"
  unlocked: z.boolean(),
})

export type TrackedItem = z.infer<typeof trackedItemSchema>

export const trackedItemsCollection = createCollection(
  localStorageCollectionOptions({
    id: 'tracked-items',
    storageKey: 'app-tracked-items-v2',
    getKey: (item) => item.id,
    schema: trackedItemSchema,
  }),
)


export const steamAchievementSchemaSchema = z.object({
  name: z.string(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  hidden: z.number(),
  icon: z.string(),
  icongray: z.string(),
})

export const globalAchievementPercentSchema = z.object({
  name: z.string(),
  percent: z.number(),
})

export const gameSchemaCacheSchema = z.object({
  appId: z.string(),
  timestamp: z.number(),
  achievements: z.array(steamAchievementSchemaSchema),
  ratings: z.array(globalAchievementPercentSchema),
})

export type GameSchemaCache = z.infer<typeof gameSchemaCacheSchema>

export const gameSchemaCollection = createCollection(
  localStorageCollectionOptions({
    id: 'game-schemas',
    storageKey: 'app-game-schemas-v1',
    getKey: (item) => item.appId,
    schema: gameSchemaCacheSchema,
  }),
)
