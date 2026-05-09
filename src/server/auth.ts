import { betterAuth } from 'better-auth'
import { createClient } from '@libsql/client'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { steamPlugin } from './steam-plugin'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  database: {
    // @ts-expect-error - @libsql/kysely-libsql relies on an outdated version of @libsql/client where sync() returns void instead of Replicated
    dialect: new LibsqlDialect({ client }),
    type: 'sqlite',
  },
  user: {
    additionalFields: {
      steamId: { type: 'string', required: false },
      displayName: { type: 'string', required: false },
      avatarUrl: { type: 'string', required: false },
    },
  },
  plugins: [steamPlugin()],
})

export type Session = typeof auth.$Infer.Session
