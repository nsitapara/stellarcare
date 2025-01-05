/**
 * Profile Update Server Action
 *
 * This module provides server-side action for handling user profile updates.
 * It requires authentication and allows users to update their profile information.
 */

'use server'

import { ApiError } from '@api/core/ApiError'
import type { UserCurrentError } from '@api/user/auth'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { profileFormSchema } from '@lib/validation'
import { getServerSession } from 'next-auth'
import type { z } from 'zod'

export type ProfileFormSchema = z.infer<typeof profileFormSchema>

/**
 * Updates the authenticated user's profile information.
 * This server action handles updates to user profile data like name.
 *
 * @param {ProfileFormSchema} data - The updated profile information
 * @returns {Promise<boolean | UserCurrentError>} True if successful, error object if validation fails
 *
 * @example
 * try {
 *   const result = await profileAction({
 *     firstName: "John",
 *     lastName: "Doe"
 *   });
 *   if (result === true) {
 *     // Handle successful profile update
 *   } else {
 *     // Handle validation errors
 *   }
 * } catch (error) {
 *   // Handle unexpected error
 * }
 */
export async function profileAction(
  data: ProfileFormSchema
): Promise<boolean | UserCurrentError> {
  const session = await getServerSession(authOptions)

  try {
    const apiClient = await getApiClient(session)

    await apiClient.users.usersMePartialUpdate({
      first_name: data.firstName,
      last_name: data.lastName
    })

    return true
  } catch (error) {
    if (error instanceof ApiError) {
      return error.body as UserCurrentError
    }
  }

  return false
}
