'use client'

import Link from 'next/link'
import type React from 'react'

export function FormFooter({
  cta,
  link,
  title
}: {
  cta: string
  link: string
  title: string
}) {
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
