/**
 * Form Footer Component
 *
 * A reusable footer component for forms that displays a call-to-action link.
 */

'use client'

import type { FormFooterProps } from '@api/forms'
import Link from 'next/link'

/**
 * Renders a form footer with a call-to-action link
 *
 * @param props - Component props including CTA text and link details
 * @returns Form footer with styled link
 */
export function FormFooter({ cta, link, title }: FormFooterProps) {
  const actionLink = (
    <Link
      href={link}
      className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
    >
      {title}
    </Link>
  )

  return (
    <p className="mt-6 text-center text-gray-300">
      {cta} {actionLink}
    </p>
  )
}
