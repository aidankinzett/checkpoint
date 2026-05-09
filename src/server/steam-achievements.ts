import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './middleware'

const STEAM_API_BASE = 'https://api.steampowered.com'

interface SteamAchievement {
  name: string
  achieved: boolean
}

interface ParsedProfile {
  steamId?: string
  vanityName?: string
}

function parseSteamProfile(input: string): ParsedProfile | null {
  const trimmed = input.trim().replace(/\/+$/, '')

  // Raw 64-bit Steam ID (17 digits)
  if (/^\d{17}$/.test(trimmed)) {
    return { steamId: trimmed }
  }

  // Full profile URL: steamcommunity.com/profiles/<id>
  const profileMatch = trimmed.match(
    /steamcommunity\.com\/profiles\/(\d{17})/,
  )
  if (profileMatch) {
    return { steamId: profileMatch[1] }
  }

  // Vanity URL: steamcommunity.com/id/<name>
  const vanityUrlMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/)
  if (vanityUrlMatch) {
    return { vanityName: vanityUrlMatch[1] }
  }

  // Bare vanity name (no slashes, not all digits)
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && !/^\d+$/.test(trimmed)) {
    return { vanityName: trimmed }
  }

  return null
}

async function resolveVanityUrl(
  apiKey: string,
  vanityName: string,
): Promise<string> {
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(vanityName)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`)
  }
  const data = await res.json()
  if (data.response.success !== 1) {
    throw new Error(
      `Could not resolve Steam vanity URL "${vanityName}". Check the profile name.`,
    )
  }
  return data.response.steamid
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
