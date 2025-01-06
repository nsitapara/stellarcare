/**
 * Success Message Component
 *
 * A reusable component for displaying success messages with consistent styling.
 */

'use client'

import type { MessageProps } from '@api/forms'

/**
 * Renders a success message with green styling
 *
 * @param props - Component props including the success message content
 * @returns Styled success message container
 */
export function SuccessMessage({ children }: MessageProps) {
  return (
    <div className="mb-6 rounded bg-green-100 px-4 py-3 text-green-700">
      {children}
    </div>
  )
}
