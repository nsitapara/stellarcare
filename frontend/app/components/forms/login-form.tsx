'use client'

import { loginAction } from '@actions/user/auth-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { loginFormSchema } from '../../lib/validation'
import { FormFooter } from '../forms/form-footer'
import { FormHeader } from '../forms/form-header'
import { TextField } from '../forms/text-field'
import { ErrorMessage } from '../messages/error-message'
import { Button } from '../ui/button'

type LoginFormSchema = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const search = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmitHandler = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await loginAction(data)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.tokens) {
        // Use signIn to set the session, but with our obtained tokens
        const signInResult = await signIn('credentials', {
          username: data.username,
          access: result.tokens.access,
          refresh: result.tokens.refresh,
          redirect: false
        })

        if (signInResult?.ok) {
          router.push('/dashboard')
          router.refresh()
        } else {
          setError('Failed to sign in')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <FormHeader
        title="Welcome back to StellarCare"
        description="Sign in to access your dashboard"
      />

      {(error ||
        (search.has('error') &&
          search.get('error') === 'CredentialsSignin')) && (
        <ErrorMessage>{error || 'Invalid username or password.'}</ErrorMessage>
      )}

      <form onSubmit={onSubmitHandler} className="space-y-6">
        <TextField
          type="text"
          register={register('username')}
          formState={formState}
          label="Username"
          placeholder="Email address or username"
        />

        <TextField
          type="password"
          register={register('password', { required: true })}
          formState={formState}
          label="Password"
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <FormFooter
        cta="Don't have an account?"
        link="/register"
        title="Sign up"
      />
    </div>
  )
}
