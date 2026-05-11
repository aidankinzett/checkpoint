import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './middleware'

const STEAM_API_BASE = 'https://api.steampowered.com'

interface SteamAchievement {
  name: string
  achieved: boolean
}


async function getPlayerAchievements(
  apiKey: string,
  steamId: string,
  appId: string,
): Promise<SteamAchievement[]> {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${appId}&l=english`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`)
  }
  const data = await res.json()

  if (!data.playerstats.success) {
    throw new Error(
      data.playerstats.error ||
        'Failed to fetch achievements. The profile may be private.',
    )
  }

  return data.playerstats.achievements.map(
    (a: { name: string; achieved: number }) => ({
      name: a.name,
      achieved: a.achieved === 1,
    }),
  )
}

export const fetchSteamAchievements = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator((data: { appId: string }) => data)
  .handler(async ({ data, context }): Promise<SteamAchievement[]> => {
    const { appId } = data
    const steamId = context.session.user.steamId

    if (!steamId) {
      throw new Error('Unauthorized: No Steam ID associated with this account.')
    }

    if (!appId) {
      throw new Error(
        "Missing 'appId' parameter. Provide a Steam App ID (e.g. '1817070' for Spider-Man Remastered).",
      )
    }

    const apiKey = process.env.STEAM_API_KEY
    if (!apiKey) {
      throw new Error('STEAM_API_KEY is not configured on the server.')
    }

    return getPlayerAchievements(apiKey, steamId, appId)
  })
