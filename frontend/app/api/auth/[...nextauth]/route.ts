/**
 * NextAuth Route Handler
 *
 * This file sets up the API routes required by NextAuth for authentication.
 * It handles:
 * - GET /api/auth/session - Session data
 * - GET /api/auth/csrf - CSRF token
 * - POST /api/auth/signin - Sign in
 * - POST /api/auth/signout - Sign out
 *
 * The authentication logic is configured in @/app/lib/auth.ts
 */

import { authOptions } from '@/app/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
