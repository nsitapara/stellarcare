'use client'

import type React from 'react'

export function FormHeader({
  title,
  description
}: {
  title: string
  description?: string
}) {
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
