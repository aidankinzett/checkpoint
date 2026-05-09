import SteamAuth from 'node-steam-openid'
import { createAuthEndpoint } from 'better-auth/api'
import { setSessionCookie } from 'better-auth/cookies'
import type { BetterAuthPlugin, GenericEndpointContext } from 'better-auth'

// ctx.context.baseURL is already "<origin>/api/auth" — strip the basePath for realm
function getAppOrigin(baseURL: string): string {
  return baseURL.replace(/\/api\/auth\/?$/, '') || baseURL
}

function getSteamAuth(baseURL: string) {
  const apiKey = process.env.STEAM_API_KEY
  if (!apiKey) throw new Error('STEAM_API_KEY is not configured')
  const origin = getAppOrigin(baseURL)
  return new SteamAuth({
    realm: origin,
    returnUrl: `${baseURL}/callback/steam`,
    apiKey,
  })
}

export function steamPlugin(): BetterAuthPlugin {
  return {
    id: 'steam',
    endpoints: {
      steamSignIn: createAuthEndpoint(
        '/sign-in/steam',
        { method: 'GET' },
        async (ctx) => {
          const baseURL = ctx.context.baseURL ?? 'http://localhost:3000'
          const steam = getSteamAuth(baseURL)
          const redirectUrl = await steam.getRedirectUrl()
          return ctx.redirect(redirectUrl)
        },
      ),

      steamCallback: createAuthEndpoint(
        '/callback/steam',
        { method: 'GET' },
        async (ctx) => {
          const baseURL = ctx.context.baseURL ?? 'http://localhost:3000'
          const steam = getSteamAuth(baseURL)

          const origin = getAppOrigin(baseURL)
          const user = await steam.authenticate(ctx.request as { url: string }).catch(() => null)
          if (!user) {
            return ctx.redirect(`${origin}?error=steam_auth_failed`)
          }

          const { steamid, username, avatar } = user as {
            steamid: string
            username: string
            avatar: { medium: string }
          }

          const syntheticEmail = `${steamid}@steam.checkpoint`

          const existing = await ctx.context.internalAdapter.findUserByEmail(syntheticEmail)

          let dbUser = existing?.user
          if (!dbUser) {
            dbUser = await ctx.context.internalAdapter.createUser({
              email: syntheticEmail,
              name: username,
              emailVerified: true,
              steamId: steamid,
              displayName: username,
              avatarUrl: avatar?.medium ?? '',
            })
          } else {
            await ctx.context.internalAdapter.updateUser(dbUser.id, {
              name: username,
              displayName: username,
              avatarUrl: avatar?.medium ?? '',
            })
          }

          const session = await ctx.context.internalAdapter.createSession(dbUser.id)
          if (!session) {
            return ctx.redirect(`${origin}?error=session_failed`)
          }

          await setSessionCookie(ctx as unknown as GenericEndpointContext, { session, user: dbUser }, false)
          return ctx.redirect(origin)
        },
      ),
    },
  }
}
