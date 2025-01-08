import { LoginForm } from '@components/forms/login-form'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login - StellarCare'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
