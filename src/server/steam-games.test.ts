import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchUserOwnedGames, fetchGameSchema, fetchGlobalAchievementRatings, fetchGameLogo } from './steam-games'
import { auth } from './auth'

vi.mock('./auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    }
  }
}))

vi.mock('@tanstack/react-start', () => ({
  createMiddleware: () => ({ server: (fn: any) => fn, client: (fn: any) => fn }),
  createServerFn: () => {
    let validator: ((x: any) => any) | undefined
    const builder = {
      middleware: () => builder,
      inputValidator: (v: any) => { validator = v; return builder },
      handler: (h: any) => {
        return async (args: any) => {
          const data = typeof validator === 'function' ? validator(args?.data) : (args?.data ?? {})
          const context = { session: { user: { steamId: '123456789' } } }
          return h({ data, context })
        }
      }
    }
    return builder
  },
}))

const globalFetch = vi.fn()

const originalFetch = global.fetch
const originalSteamKey = process.env.STEAM_API_KEY
const originalGridKey = process.env.STEAMGRIDDB_API_KEY

describe('steam-games', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = globalFetch as any
    process.env.STEAM_API_KEY = 'test_key'
    process.env.STEAMGRIDDB_API_KEY = 'test_griddb_key'

    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { steamId: '123456789' }
    } as any)
  })

  afterEach(() => {
    global.fetch = originalFetch
    if (originalSteamKey === undefined) {
      delete process.env.STEAM_API_KEY
    } else {
      process.env.STEAM_API_KEY = originalSteamKey
    }
    if (originalGridKey === undefined) {
      delete process.env.STEAMGRIDDB_API_KEY
    } else {
      process.env.STEAMGRIDDB_API_KEY = originalGridKey
    }
  })

  describe('fetchUserOwnedGames', () => {
    it('returns games on success', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: { games: [{ appid: 10, name: 'CS:GO' }] } })
      })

      const result = await fetchUserOwnedGames()
      expect(result).toEqual([{ appid: 10, name: 'CS:GO' }])
      expect(globalFetch).toHaveBeenCalledWith(
        expect.stringContaining('IPlayerService/GetOwnedGames/v1/?key=test_key&steamid=123456789')
      )
    })

    it('throws when STEAM_API_KEY is missing', async () => {
      process.env.STEAM_API_KEY = ''
      await expect(fetchUserOwnedGames()).rejects.toThrow('STEAM_API_KEY is not configured')
    })

    it('throws on HTTP error', async () => {
      globalFetch.mockResolvedValueOnce({ ok: false, status: 503 })
      await expect(fetchUserOwnedGames()).rejects.toThrow('Steam API error: 503')
    })
  })

  describe('fetchGameSchema', () => {
    it('returns schema on success', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          game: { availableGameStats: { achievements: [{ name: 'ACH_1' }] } }
        })
      })

      const result = await fetchGameSchema({ data: { appId: '10' } })
      expect(result).toEqual([{ name: 'ACH_1' }])
      expect(globalFetch).toHaveBeenCalledWith(
        expect.stringContaining('GetSchemaForGame/v2/?key=test_key&appid=10')
      )
    })

    it('throws on HTTP error', async () => {
      globalFetch.mockResolvedValueOnce({ ok: false, status: 404 })
      await expect(fetchGameSchema({ data: { appId: '10' } })).rejects.toThrow('Steam API error: 404')
    })
  })

  describe('fetchGlobalAchievementRatings', () => {
    it('returns ratings on success', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          achievementpercentages: { achievements: [{ name: 'ACH_1', percent: 50.5 }] }
        })
      })

      const result = await fetchGlobalAchievementRatings({ data: { appId: '10' } })
      expect(result).toEqual([{ name: 'ACH_1', percent: 50.5 }])
    })

    it('returns empty array on HTTP error', async () => {
      globalFetch.mockResolvedValueOnce({ ok: false, status: 403 })
      const result = await fetchGlobalAchievementRatings({ data: { appId: '10' } })
      expect(result).toEqual([])
    })
  })

  describe('fetchGameLogo', () => {
    it('returns logo url on success', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ url: 'https://logo.png' }]
        })
      })

      const result = await fetchGameLogo({ data: { appId: '10' } })
      expect(result).toBe('https://logo.png')
      expect(globalFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://www.steamgriddb.com/api/v2/logos/steam/10'),
        { headers: { Authorization: 'Bearer test_griddb_key' } }
      )
    })

    it('returns null when STEAMGRIDDB_API_KEY is missing', async () => {
      process.env.STEAMGRIDDB_API_KEY = ''
      const result = await fetchGameLogo({ data: { appId: '10' } })
      expect(result).toBeNull()
      expect(globalFetch).not.toHaveBeenCalled()
    })

    it('returns null on HTTP error', async () => {
      globalFetch.mockResolvedValueOnce({ ok: false, status: 404 })
      const result = await fetchGameLogo({ data: { appId: '10' } })
      expect(result).toBeNull()
    })
  })
})
