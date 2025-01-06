/**
 * Submit Field Component
 *
 * A reusable submit button component for forms with loading state support.
 */

'use client'

import type { SubmitFieldProps } from '@api/forms'
import { twMerge } from 'tailwind-merge'

/**
 * Renders a submit button with loading state
 *
 * @param props - Component props including loading state and button text
 * @returns Submit button with optional loading state
 */
export function SubmitField({ children, isLoading }: SubmitFieldProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={twMerge(
        'block h-10 w-full rounded bg-primary font-medium text-white',
        isLoading && 'bg-primary/50'
      )}
    >
      {children}
    </button>
  )
}
