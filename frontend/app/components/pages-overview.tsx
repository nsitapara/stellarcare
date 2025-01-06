'use client'

import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

/**
 * Component that provides a sign-in button that triggers the authentication flow
 * @returns A button component that initiates the sign-in process when clicked
 */
export function SignInLink() {
  return (
    <button
      type="button"
      onClick={() => signIn()}
      className="cursor-pointer text-purple-600 underline"
    >
      Login
    </button>
  )
}

/**
 * Component that provides a sign-out button that triggers the logout flow
 * @returns A button component that initiates the sign-out process when clicked
 */
export function SignOutLink() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="cursor-pointer text-purple-600 underline"
    >
      Logout
    </button>
  )
}

/**
 * Main component that displays an overview of available pages in the application
 * Organizes pages into two categories:
 * 1. Authenticated pages - requires user login (Profile, Change password, Delete account)
 * 2. Anonymous pages - accessible without authentication (Login, Register, Logout)
 * @returns A structured list of navigation links organized by authentication requirement
 */
export function PagesOverview() {
  return (
    <ul className="flex flex-col gap-6">
      <li className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <span className="w-40 font-medium">Authenticated pages</span>

        <ul className="flex flex-row gap-6">
          <li>
            <Link href="/profile" className="text-purple-600 underline">
              Profile
            </Link>
          </li>

          <li>
            <Link href="/change-password" className="text-purple-600 underline">
              Change password
            </Link>
          </li>

          <li>
            <Link href="/delete-account" className="text-purple-600 underline">
              Delete account
            </Link>
          </li>
        </ul>
      </li>

      <li className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <span className="w-40 font-medium">Anonymous pages</span>

        <ul className="flex flex-row gap-6">
          <li>
            <SignInLink />
          </li>

          <li>
            <a href="/register" className="text-purple-600 underline">
              Register
            </a>
          </li>

          <li>
            <SignOutLink />
          </li>
        </ul>
      </li>
    </ul>
  )
}
