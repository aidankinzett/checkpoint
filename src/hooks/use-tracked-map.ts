import { useState, useCallback, useMemo } from 'react'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { trackedItemsCollection } from '~/lib/db'

interface UseTrackedMapReturn {
  data: Record<string, boolean>
  loaded: boolean
  saving: boolean
  toggle: (id: string) => void
  reset: () => void
  setAll: (data: Record<string, boolean>) => void
}

export function useTrackedMap(storageKey: string): UseTrackedMapReturn {
  const { data: items } = useLiveQuery((q) =>
    q.from({ item: trackedItemsCollection })
      .where(({ item }) => eq(item.storageKey, storageKey))
  )

  const data = useMemo(() => {
    const record: Record<string, boolean> = {}
    if (items) {
      for (const item of items) {
        if (item.unlocked) {
          record[item.itemId] = true
        }
      }
    }
    return record
  }, [items])

  const [saving, setSaving] = useState(false)
  const loaded = items !== undefined

  const toggle = useCallback((id: string) => {
    setSaving(true)
    const fullId = `${storageKey}:${id}`
    const isUnlocked = data[id] === true

    if (isUnlocked) {
      trackedItemsCollection.delete(fullId)
    } else {
      trackedItemsCollection.insert({
        id: fullId,
        storageKey,
        itemId: id,
        unlocked: true,
      })
    }
    setTimeout(() => setSaving(false), 400)
  }, [storageKey, data])

  const reset = useCallback(() => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setSaving(true)
      if (items) {
        for (const item of items) {
          trackedItemsCollection.delete(item.id)
        }
      }
      setTimeout(() => setSaving(false), 400)
    }
  }, [items])

  const setAll = useCallback((newData: Record<string, boolean>) => {
    setSaving(true)
    for (const [id, unlocked] of Object.entries(newData)) {
      const fullId = `${storageKey}:${id}`
      if (unlocked) {
        trackedItemsCollection.insert({
          id: fullId,
          storageKey,
          itemId: id,
          unlocked: true,
        })
      } else {
        trackedItemsCollection.delete(fullId)
      }
    }
    setTimeout(() => setSaving(false), 400)
  }, [storageKey])

  return { data, loaded, saving, toggle, reset, setAll }
}
