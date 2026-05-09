import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

export function useSession() {
  return authClient.useSession()
}
