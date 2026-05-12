import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSteamAchievements } from './steam-achievements'
import { auth } from './auth'

vi.mock('./auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    }
  }
}))

vi.mock('@tanstack/react-start', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    createServerFn: () => {
      let currentValidator = (x: any) => x
      const builder = {
        middleware: () => builder,
        inputValidator: (v: any) => { currentValidator = v; return builder },
        handler: (h: any) => {
          return async (args: any) => {
            const data = currentValidator(args?.data)
            const context = { session: { user: { steamId: '123456789' } } }
            return h({ data, context })
          }
        }
      }
      return builder
    }
  }
})

const globalFetch = vi.fn()
global.fetch = globalFetch as any

describe('steam-achievements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STEAM_API_KEY = 'test_key'
    
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { steamId: '123456789' }
    } as any)
  })

  describe('fetchSteamAchievements', () => {
    it('returns formatted achievements on success', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          playerstats: {
            success: true,
            achievements: [
              { name: 'ACH_1', achieved: 1 },
              { name: 'ACH_2', achieved: 0 },
            ]
          }
        })
      })

      const result = await fetchSteamAchievements({ data: { appId: '10' } })
      
      expect(result).toEqual([
        { name: 'ACH_1', achieved: true },
        { name: 'ACH_2', achieved: false },
      ])
      
      expect(globalFetch).toHaveBeenCalledWith(
        expect.stringContaining('GetPlayerAchievements/v1/?key=test_key&steamid=123456789&appid=10')
      )
    })

    it('throws when api responds with an error', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchSteamAchievements({ data: { appId: '10' } })).rejects.toThrow('Steam API error: 404')
    })
    
    it('throws when profile is private (success is false)', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          playerstats: {
            success: false,
            error: 'Profile is private'
          }
        })
      })

      await expect(fetchSteamAchievements({ data: { appId: '10' } })).rejects.toThrow('Profile is private')
    })

    it('throws when STEAM_API_KEY is missing', async () => {
      process.env.STEAM_API_KEY = ''
      await expect(fetchSteamAchievements({ data: { appId: '10' } })).rejects.toThrow('STEAM_API_KEY is not configured on the server.')
    })
  })
})
