import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './middleware'

const STEAM_API_BASE = 'https://api.steampowered.com'

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY
  if (!key) throw new Error('STEAM_API_KEY is not configured')
  return key
}

export interface OwnedGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
}

export interface SteamAchievementSchema {
  name: string
  displayName: string
  description: string
  hidden: number
  icon: string
  icongray: string
}

export interface GlobalAchievementPercent {
  name: string
  percent: number
}

export const fetchUserOwnedGames = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OwnedGame[]> => {
    const steamId = context.session.user.steamId
    if (!steamId) {
      throw new Error('Unauthorized: No Steam ID associated with this account.')
    }
    const apiKey = getApiKey()
    const url = new URL(`${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/`)
    url.searchParams.set('key', apiKey)
    url.searchParams.set('steamid', steamId)
    url.searchParams.set('include_appinfo', '1')
    url.searchParams.set('include_played_free_games', '1')
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`Steam API error: ${res.status}`)
    const json = await res.json()
    return json.response?.games ?? []
  })

export const fetchGameSchema = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ appId: z.string().regex(/^\d+$/) }))
  .handler(async ({ data }): Promise<SteamAchievementSchema[]> => {
    const apiKey = getApiKey()
    const url = new URL(`${STEAM_API_BASE}/ISteamUserStats/GetSchemaForGame/v2/`)
    url.searchParams.set('key', apiKey)
    url.searchParams.set('appid', data.appId)
    url.searchParams.set('l', 'english')
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`Steam API error: ${res.status}`)
    const json = await res.json()
    return json.game?.availableGameStats?.achievements ?? []
  })

export const fetchGlobalAchievementRatings = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ appId: z.string().regex(/^\d+$/) }))
  .handler(async ({ data }): Promise<GlobalAchievementPercent[]> => {
    const apiKey = getApiKey()
    const url = new URL(
      `${STEAM_API_BASE}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/`,
    )
    url.searchParams.set('gameid', data.appId)
    url.searchParams.set('key', apiKey)
    const res = await fetch(url.toString())
    if (!res.ok) return []
    const json = await res.json()
    return json.achievementpercentages?.achievements ?? []
  })

export const fetchGameLogo = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ appId: z.string().regex(/^\d+$/) }))
  .handler(async ({ data }): Promise<string | null> => {
    const apiKey = process.env.STEAMGRIDDB_API_KEY
    if (!apiKey) return null
    const url = new URL(
      `https://www.steamgriddb.com/api/v2/logos/steam/${encodeURIComponent(data.appId)}`,
    )
    url.searchParams.set('styles', 'official,white')
    url.searchParams.set('mimes', 'image/png')
    url.searchParams.set('types', 'static')
    url.searchParams.set('limit', '1')
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data?.[0]?.url ?? null
  })
