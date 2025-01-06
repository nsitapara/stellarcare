/**
 * Form Header Component
 *
 * A reusable header component for forms that displays a title and optional description.
 */

'use client'

import type { FormHeaderProps } from '@api/forms'

/**
 * Renders a form header with title and optional description
 *
 * @param props - Component props including title and optional description
 * @returns Form header with styling
 */
export function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>

      {description && (
        <p className="text-lg text-gray-300 mb-8">{description}</p>
      )}

      <hr className="border-gray-700 mb-8" />
    </>
  )
}
