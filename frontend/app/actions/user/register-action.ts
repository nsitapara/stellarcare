/**
 * User Registration Server Action
 *
 * This module provides server-side action for handling new user registration.
 * It validates user input and creates new user accounts.
 */

'use server'

import { ApiError } from '@api/core/ApiError'
import type { UserCreateError } from '@api/user/auth'
import { getApiClient } from '@lib/api'
import type { registerFormSchema } from '@lib/validation'
import type { z } from 'zod'

export type RegisterFormSchema = z.infer<typeof registerFormSchema>

/**
 * Registers a new user account.
 * This server action validates the registration data and creates a new user account.
 *
 * @param {RegisterFormSchema} data - The registration form data
 * @returns {Promise<UserCreateError | boolean>} True if successful, error object if validation fails
 *
 * @example
 * try {
 *   const result = await registerAction({
 *     username: "newuser",
 *     password: "password123",
 *     passwordRetype: "password123"
 *   });
 *   if (result === true) {
 *     // Handle successful registration
 *   } else {
 *     // Handle validation errors
 *   }
 * } catch (error) {
 *   // Handle unexpected error
 * }
 */
export async function registerAction(
  data: RegisterFormSchema
): Promise<UserCreateError | boolean> {
  try {
    const apiClient = await getApiClient()

    await apiClient.users.usersCreate({
      username: data.username,
      password: data.password,
      password_retype: data.passwordRetype
    })

    return true
  } catch (error) {
    if (error instanceof ApiError) {
      return error.body as UserCreateError
    }
  }

  return false
}
