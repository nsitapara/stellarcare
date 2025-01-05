import type { Session } from 'next-auth'
import { ApiClient } from '../../types/api'

export async function getApiClient(session?: Session | null) {
  return new ApiClient({
    BASE: process.env.API_URL,
    HEADERS: {
      ...(session && {
        Authorization: `Bearer ${session.accessToken}`
      })
    }
  })
}
