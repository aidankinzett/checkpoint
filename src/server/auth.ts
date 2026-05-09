import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'
import { steamPlugin } from './steam-plugin'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  database: new Database(process.env.DATABASE_PATH ?? './local.db'),
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
