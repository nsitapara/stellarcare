/**
 * NextAuth Configuration and JWT Token Management
 *
 * This module configures NextAuth to work with our Django backend's JWT authentication.
 * It handles:
 * - JWT token decoding and validation
 * - Session management
 * - Token refresh logic
 * - Credentials provider setup
 */

import { refreshTokenAction } from '@actions/user/auth-action'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * Decodes a JWT token and returns its payload
 *
 * @param token - JWT token string to decode
 * @returns Decoded token payload containing user information and expiry
 */
function decodeToken(token: string): {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
} {
  return JSON.parse(atob(token.split('.')[1]))
}

/**
 * NextAuth configuration options
 *
 * This configuration:
 * - Uses JWT strategy for session handling
 * - Customizes the sign-in page route
 * - Implements session and JWT callbacks for token management
 * - Sets up the credentials provider for username/password authentication
 */
const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    /**
     * Session Callback
     *
     * Runs when a session is checked. Validates token expiry and
     * adds user information and tokens to the session.
     */
    session: async ({ session, token }) => {
      const access = decodeToken(token.access)
      const refresh = decodeToken(token.refresh)

      if (Date.now() / 1000 > access.exp && Date.now() / 1000 > refresh.exp) {
        return Promise.reject({
          error: new Error('Refresh token expired')
        })
      }

      session.user = {
        id: access.user_id,
        username: token.username
      }

      session.refreshToken = token.refresh
      session.accessToken = token.access

      return session
    },
    /**
     * JWT Callback
     *
     * Runs when a JWT is created/updated. Handles token refresh
     * when the access token expires.
     */
    jwt: async ({ token, user }) => {
      if (user?.username) {
        return { ...token, ...user }
      }

      // Refresh token if access token is expired
      if (Date.now() / 1000 > decodeToken(token.access).exp) {
        try {
          const result = await refreshTokenAction(token.refresh)
          if (result.access) {
            token.access = result.access
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          return token
        }
      }

      return token
    }
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      /**
       * Authorize Callback
       *
       * Validates the credentials provided during sign-in.
       * For our implementation, it validates pre-obtained tokens
       * rather than handling the actual authentication.
       */
      async authorize(credentials: Record<string, string> | undefined) {
        if (
          !credentials?.access ||
          !credentials?.refresh ||
          !credentials?.username
        ) {
          return null
        }

        try {
          const decoded = decodeToken(credentials.access)
          return {
            id: decoded.user_id,
            username: credentials.username,
            access: credentials.access,
            refresh: credentials.refresh
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ]
}

export { authOptions }
