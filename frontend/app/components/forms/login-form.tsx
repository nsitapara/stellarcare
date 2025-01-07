'use client'

/**
 * LoginForm Component
 *
 * A form component for user authentication that handles:
 * - Username/email and password input
 * - Form validation
 * - Error handling
 * - Loading states
 * - Successful login redirection
 */

import { loginAction } from '@actions/user/auth-action'
import type { LoginFormSchema } from '@api/forms/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginFormSchema } from '../../lib/validation'
import { FormFooter } from '../forms/form-footer'
import { TextField } from '../forms/text-field'
import { ErrorMessage } from '../messages/error-message'
import { Button } from '../ui/button'

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
          Welcome back to StellarCare
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sign in to access your dashboard
        </p>
      </div>

      {(error ||
        (search.has('error') &&
          search.get('error') === 'CredentialsSignin')) && (
        <ErrorMessage>{error || 'Invalid username or password.'}</ErrorMessage>
      )}

      <div className="p-6 rounded-lg border-2 border-border/60 dark:border-border/40 bg-card animate-fade-up">
        <form onSubmit={onSubmitHandler} className="space-y-4">
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
            className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
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
      </div>

      <div className="text-center animate-fade-up [animation-delay:200ms]">
        <FormFooter
          cta="Don't have an account?"
          link="/register"
          title="Sign up"
        />
      </div>
    </div>
  )
}
