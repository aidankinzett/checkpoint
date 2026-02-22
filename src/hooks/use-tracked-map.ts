import { useState, useCallback } from 'react'

interface UseTrackedMapReturn {
  data: Record<string, boolean>
  loaded: boolean
  saving: boolean
  toggle: (id: string) => void
  reset: () => void
  setAll: (data: Record<string, boolean>) => void
}

function readStorage(key: string): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch { /* localStorage unavailable */ }
  return {}
}

export function useTrackedMap(storageKey: string): UseTrackedMapReturn {
  const [data, setData] = useState<Record<string, boolean>>(() => readStorage(storageKey))
  const [saving, setSaving] = useState(false)
  // Route has ssr: false so localStorage is always available at init
  const loaded = true

  const save = useCallback((next: Record<string, boolean>) => {
    setSaving(true)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch { /* localStorage unavailable */ }
    setTimeout(() => setSaving(false), 400)
  }, [storageKey])

  const toggle = useCallback((id: string) => {
    setData((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) delete next[id]
      save(next)
      return next
    })
  }, [save])

  const reset = useCallback(() => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setData({})
      save({})
    }
  }, [save])

  const setAll = useCallback((newData: Record<string, boolean>) => {
    setData(newData)
    save(newData)
  }, [save])

  return { data, loaded, saving, toggle, reset, setAll }
}
