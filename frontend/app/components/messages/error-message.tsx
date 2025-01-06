/**
 * Error Message Component
 *
 * A reusable component for displaying error messages with consistent styling.
 */

'use client'

import type { MessageProps } from '@api/forms'

/**
 * Renders an error message with red styling
 *
 * @param props - Component props including the error message content
 * @returns Styled error message container
 */
export function ErrorMessage({ children }: MessageProps) {
  return (
    <div className="mb-6 rounded bg-red-100 px-4 py-3 text-red-700">
      {children}
    </div>
  )
}
