import { createServerFn } from '@tanstack/react-start'

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
  .inputValidator((data: { steamId: string }) => data)
  .handler(async ({ data }): Promise<OwnedGame[]> => {
    const apiKey = getApiKey()
    const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${data.steamId}&include_appinfo=1&include_played_free_games=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Steam API error: ${res.status}`)
    const json = await res.json()
    return json.response?.games ?? []
  })

export const fetchGameSchema = createServerFn({ method: 'GET' })
  .inputValidator((data: { appId: string }) => data)
  .handler(async ({ data }): Promise<SteamAchievementSchema[]> => {
    const apiKey = getApiKey()
    const url = `${STEAM_API_BASE}/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${data.appId}&l=english`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Steam API error: ${res.status}`)
    const json = await res.json()
    return json.game?.availableGameStats?.achievements ?? []
  })

export const fetchGlobalAchievementRatings = createServerFn({ method: 'GET' })
  .inputValidator((data: { appId: string }) => data)
  .handler(async ({ data }): Promise<GlobalAchievementPercent[]> => {
    const apiKey = getApiKey()
    const url = `${STEAM_API_BASE}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${data.appId}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    return json.achievementpercentages?.achievements ?? []
  })

export const fetchGameLogo = createServerFn({ method: 'GET' })
  .inputValidator((data: { appId: string }) => data)
  .handler(async ({ data }): Promise<string | null> => {
    const apiKey = process.env.STEAMGRIDDB_API_KEY
    if (!apiKey) return null
    const url = `https://www.steamgriddb.com/api/v2/logos/steam/${data.appId}?styles=official,white&mimes=image%2Fpng&types=static&limit=1`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data?.[0]?.url ?? null
  })
