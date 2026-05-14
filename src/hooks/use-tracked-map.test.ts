// @vitest-environment happy-dom
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTrackedMap } from './use-tracked-map'
import { trackedItemsCollection } from '~/lib/db'
import * as reactDb from '@tanstack/react-db'

vi.mock('@tanstack/react-db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-db')>()
  return {
    ...actual,
    useLiveQuery: vi.fn(),
  }
})

vi.mock('~/lib/db', () => ({
  trackedItemsCollection: {
    delete: vi.fn().mockResolvedValue(undefined),
    insert: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
  }
}))

describe('useTrackedMap', () => {
  const storageKey = 'test-storage'
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with no items', () => {
    vi.mocked(reactDb.useLiveQuery).mockReturnValue({ data: [] } as any)
    
    const { result } = renderHook(() => useTrackedMap(storageKey))
    
    expect(result.current.data).toEqual({})
    expect(result.current.loaded).toBe(true)
    expect(result.current.saving).toBe(false)
  })

  it('maps unlocked items correctly', () => {
    vi.mocked(reactDb.useLiveQuery).mockReturnValue({
      data: [
        { id: `${storageKey}:item1`, storageKey, itemId: 'item1', unlocked: true },
        { id: `${storageKey}:item2`, storageKey, itemId: 'item2', unlocked: false },
        { id: `${storageKey}:item3`, storageKey, itemId: 'item3', unlocked: true },
      ]
    } as any)
    
    const { result } = renderHook(() => useTrackedMap(storageKey))
    
    expect(result.current.data).toEqual({
      item1: true,
      item3: true,
    })
  })

  it('toggles an item to unlocked', async () => {
    vi.mocked(reactDb.useLiveQuery).mockReturnValue({ data: [] } as any)
    vi.useFakeTimers()
    
    const { result } = renderHook(() => useTrackedMap(storageKey))
    
    act(() => {
      result.current.toggle('item1')
    })
    
    expect(trackedItemsCollection.insert).toHaveBeenCalledWith({
      id: `${storageKey}:item1`,
      storageKey,
      itemId: 'item1',
      unlocked: true,
    })
    
    expect(result.current.saving).toBe(true)
    
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(result.current.saving).toBe(false)
    vi.useRealTimers()
  })

  it('toggles an item to locked (deletes)', () => {
    vi.mocked(reactDb.useLiveQuery).mockReturnValue({
      data: [
        { id: `${storageKey}:item1`, storageKey, itemId: 'item1', unlocked: true },
      ]
    } as any)
    
    const { result } = renderHook(() => useTrackedMap(storageKey))
    
    act(() => {
      result.current.toggle('item1')
    })
    
    expect(trackedItemsCollection.delete).toHaveBeenCalledWith(`${storageKey}:item1`)
  })

  it('sets all items correctly', () => {
    vi.mocked(reactDb.useLiveQuery).mockReturnValue({ data: [] } as any)

    const { result } = renderHook(() => useTrackedMap(storageKey))

    act(() => {
      result.current.setAll({ item1: true, item2: false })
    })

    expect(trackedItemsCollection.insert).toHaveBeenCalledWith({
      id: `${storageKey}:item1`,
      storageKey,
      itemId: 'item1',
      unlocked: true,
    })
    expect(trackedItemsCollection.delete).toHaveBeenCalledWith(`${storageKey}:item2`)
  })

  describe('reset', () => {
    it('deletes all items when user confirms', () => {
      const items = [
        { id: `${storageKey}:item1`, storageKey, itemId: 'item1', unlocked: true },
        { id: `${storageKey}:item2`, storageKey, itemId: 'item2', unlocked: true },
      ]
      vi.mocked(reactDb.useLiveQuery).mockReturnValue({ data: items } as any)
      vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))

      const { result } = renderHook(() => useTrackedMap(storageKey))

      act(() => {
        result.current.reset()
      })

      expect(trackedItemsCollection.delete).toHaveBeenCalledWith(`${storageKey}:item1`)
      expect(trackedItemsCollection.delete).toHaveBeenCalledWith(`${storageKey}:item2`)
      expect(result.current.saving).toBe(true)
    })

    it('does nothing when user cancels', () => {
      const items = [
        { id: `${storageKey}:item1`, storageKey, itemId: 'item1', unlocked: true },
      ]
      vi.mocked(reactDb.useLiveQuery).mockReturnValue({ data: items } as any)
      vi.stubGlobal('confirm', vi.fn().mockReturnValue(false))

      const { result } = renderHook(() => useTrackedMap(storageKey))

      act(() => {
        result.current.reset()
      })

      expect(trackedItemsCollection.delete).not.toHaveBeenCalled()
      expect(result.current.saving).toBe(false)
    })
  })
})
