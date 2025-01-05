/**
 * Represents the response from a successful login
 */
export interface LoginResponse {
  access: string
  refresh: string
}

/**
 * Represents API error responses for user creation
 */
export interface UserCreateError {
  username?: string[]
  password?: string[]
  password_retype?: string[]
  non_field_errors?: string[]
}

/**
 * Represents API error responses for password change
 */
export interface UserChangePasswordError {
  password?: string[]
  password_new?: string[]
  password_retype?: string[]
  non_field_errors?: string[]
}

/**
 * Represents API error responses for user profile updates
 */
export interface UserCurrentError {
  first_name?: string[]
  last_name?: string[]
  non_field_errors?: string[]
}
