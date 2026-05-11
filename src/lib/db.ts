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
