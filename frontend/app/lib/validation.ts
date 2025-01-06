import { z } from 'zod'

/**
 * Validation schema for user login form.
 * @requires username - Minimum 6 characters
 * @requires password - Minimum 8 characters
 */
const loginFormSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(8)
})

/**
 * Validation schema for user registration form.
 * @requires username - Minimum 6 characters
 * @requires password - Minimum 6 characters
 * @requires passwordRetype - Must match password field
 */
const registerFormSchema = z
  .object({
    username: z.string().min(6),
    password: z.string().min(6),
    passwordRetype: z.string().min(6)
  })
  .refine((data) => data.password === data.passwordRetype, {
    message: 'Passwords are not matching',
    path: ['passwordRetype']
  })

/**
 * Validation schema for user profile form.
 * @property {string} firstName - Optional user's first name
 * @property {string} lastName - Optional user's last name
 */
const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

/**
 * Validation schema for account deletion form.
 * @requires username - Minimum 6 characters
 * @requires usernameCurrent - Must match username field for confirmation
 */
const deleteAccountFormSchema = z
  .object({
    username: z.string().min(6),
    usernameCurrent: z.string().min(6).optional()
  })
  .passthrough()
  .refine((data) => data.username === data.usernameCurrent, {
    message: 'Username is not matching',
    path: ['username']
  })

/**
 * Validation schema for password change form.
 * @requires password - Current password, minimum 8 characters
 * @requires passwordNew - New password, minimum 8 characters, must be different from current
 * @requires passwordRetype - Must match new password
 */
const changePasswordFormSchema = z
  .object({
    password: z.string().min(8),
    passwordNew: z.string().min(8),
    passwordRetype: z.string().min(8)
  })
  .refine((data) => data.passwordNew !== data.password, {
    message: 'Both new and current passwords are same',
    path: ['passwordNew']
  })
  .refine((data) => data.passwordNew === data.passwordRetype, {
    message: 'Passwords are not matching',
    path: ['passwordRetype']
  })

export {
  changePasswordFormSchema,
  deleteAccountFormSchema,
  loginFormSchema,
  profileFormSchema,
  registerFormSchema
}
