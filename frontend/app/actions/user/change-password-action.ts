/**
 * Change Password Server Action
 *
 * This module provides server-side action for handling password changes.
 * It requires authentication and validates the current password before allowing changes.
 */

'use server'

import { ApiError } from '@api/core/ApiError'
import type { UserChangePasswordError } from '@api/user/auth'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { changePasswordFormSchema } from '@lib/validation'
import { getServerSession } from 'next-auth'
import type { z } from 'zod'

export type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>

/**
 * Changes the authenticated user's password.
 * This server action validates the current password and updates it with the new one.
 *
 * @param {ChangePasswordFormSchema} data - Object containing current and new password
 * @returns {Promise<UserChangePasswordError | boolean>} True if successful, error object if validation fails
 *
 * @example
 * try {
 *   const result = await changePasswordAction({
 *     password: "currentPass",
 *     passwordNew: "newPass",
 *     passwordRetype: "newPass"
 *   });
 *   if (result === true) {
 *     // Handle successful password change
 *   } else {
 *     // Handle validation errors
 *   }
 * } catch (error) {
 *   // Handle unexpected error
 * }
 */
export async function changePasswordAction(
  data: ChangePasswordFormSchema
): Promise<UserChangePasswordError | boolean> {
  const session = await getServerSession(authOptions)

  try {
    const apiClient = await getApiClient(session)

    await apiClient.users.usersChangePasswordCreate({
      password: data.password,
      password_new: data.passwordNew,
      password_retype: data.passwordRetype
    })

    return true
  } catch (error) {
    if (error instanceof ApiError) {
      return error.body as UserChangePasswordError
    }
  }

  return false
}
