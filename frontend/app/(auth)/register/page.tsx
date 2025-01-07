import { registerAction } from '@actions/user/register-action'
import { RegisterForm } from '@components/forms/register-form'
import { sharedViewport } from '@lib/metadata'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = sharedViewport

export const metadata: Metadata = {
  title: 'Create Account | StellarCare'
}

export default function Register() {
  return <RegisterForm onSubmitHandler={registerAction} />
}
