/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserCreate } from '../models/UserCreate'
import type { TokenObtainPair } from '../models/TokenObtainPair'
import type { UserCreateError } from '../models/UserCreateError'

/**
 * Schema for login form data
 */
export type LoginFormSchema = Omit<TokenObtainPair, 'access' | 'refresh'>

/**
 * Schema for registration form data
 */
export interface RegisterFormSchema {
  username: string
  password: string
  passwordRetype: string
}

/**
 * API error response for registration
 */
export type RegisterFormError = {
  [K in keyof UserCreateError]-?: string[]
} & {
  [key: string]: string[]
}
