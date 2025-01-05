/**
 * Authentication Server Actions
 *
 * This module provides server-side actions for handling authentication.
 * It works in conjunction with NextAuth but handles the direct API interactions
 * with our Django backend for token-based authentication.
 */

'use server'

import { ApiError } from '@api/core'
import { getApiClient } from '@lib/api'
import type { loginFormSchema } from '@lib/validation'
import type { z } from 'zod'

export type LoginFormSchema = z.infer<typeof loginFormSchema>

/**
 * Handles user login by authenticating with the backend API
 *
 * @param data - Login form data containing username and password
 * @returns Object containing either tokens on success or error message on failure
 */
export async function loginAction(
  data: LoginFormSchema
): Promise<{ error?: string; tokens?: { access: string; refresh: string } }> {
  try {
    const apiClient = await getApiClient()
    const res = await apiClient.token.tokenCreate({
      username: data.username,
      password: data.password,
      access: '',
      refresh: ''
    })

    return {
      tokens: {
        access: res.access,
        refresh: res.refresh
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof ApiError) {
      return { error: error.body?.detail || 'Invalid credentials' }
    }
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Refreshes an expired access token using a valid refresh token
 *
 * @param refreshToken - The refresh token to use for obtaining a new access token
 * @returns Object containing either the new access token or error message
 */
export async function refreshTokenAction(
  refreshToken: string
): Promise<{ error?: string; access?: string }> {
  try {
    const apiClient = await getApiClient()
    const res = await apiClient.token.tokenRefreshCreate({
      access: '',
      refresh: refreshToken
    })

    return { access: res.access }
  } catch (error) {
    console.error('Token refresh error:', error)
    if (error instanceof ApiError) {
      return { error: 'Session expired. Please login again.' }
    }
    return { error: 'Failed to refresh session' }
  }
}
