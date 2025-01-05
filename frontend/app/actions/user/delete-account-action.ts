/**
 * Delete Account Server Action
 *
 * This module provides server-side action for handling account deletion.
 * It requires authentication and permanently removes the user's account.
 */

'use server'

import { ApiError } from '@api/core/ApiError'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { deleteAccountFormSchema } from '@lib/validation'
import { getServerSession } from 'next-auth'
import type { z } from 'zod'

export type DeleteAccountFormSchema = z.infer<typeof deleteAccountFormSchema>

/**
 * Deletes the authenticated user's account.
 * This server action permanently removes the user's account and all associated data.
 *
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise
 *
 * @example
 * try {
 *   const success = await deleteAccountAction();
 *   if (success) {
 *     // Handle successful account deletion
 *   } else {
 *     // Handle deletion failure
 *   }
 * } catch (error) {
 *   // Handle unexpected error
 * }
 */
export async function deleteAccountAction(): Promise<boolean> {
  const session = await getServerSession(authOptions)

  try {
    const apiClient = await getApiClient(session)

    if (session !== null) {
      await apiClient.users.usersDeleteAccountDestroy()
      return true
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return false
    }
  }

  return false
}
