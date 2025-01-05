import type { Session } from 'next-auth'
import { ApiClient } from '../../types/api'

/**
 * Creates and configures an API client instance with optional authentication.
 *
 * @param session - Optional NextAuth session object containing the user's authentication data
 * @returns A configured ApiClient instance with base URL and optional auth headers
 *
 * Features:
 * - Uses environment variable API_URL for base URL configuration
 * - Automatically adds Bearer token authentication if session is provided
 * - Creates a new instance for each call to ensure fresh configuration
 */
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
