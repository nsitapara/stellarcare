import { LoginForm } from '@components/forms/login-form'
import { sharedViewport } from '@lib/metadata'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'

export const viewport: Viewport = sharedViewport

export const metadata: Metadata = {
  title: 'Sign In | StellarCare'
}

export default function Login() {
  return (
    <div className="auth-container">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
