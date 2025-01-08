/**
 * RegisterForm Component
 *
 * A form component for user registration that handles:
 * - Username and password input with confirmation
 * - Form validation
 * - Error handling
 * - Successful registration redirection
 * - Integration with backend registration API
 */

'use client'

import type { registerAction } from '@actions/user/register-action'
import type { RegisterFormError, RegisterFormSchema } from '@api/forms/auth'
import { FormFooter } from '@components/forms/form-footer'
import { SubmitField } from '@components/forms/submit-field'
import { TextField } from '@components/forms/text-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { fieldApiError } from '@lib/forms'
import { registerFormSchema } from '@lib/validation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

export function RegisterForm({
  onSubmitHandler
}: { onSubmitHandler: typeof registerAction }) {
  const { formState, handleSubmit, register, setError } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema)
    })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
          Welcome to StellarCare
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sign up to access your dashboard
        </p>
      </div>

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res === true) {
            signIn()
          } else if (typeof res !== 'boolean') {
            const errors = res as RegisterFormError
            fieldApiError('username', 'username', errors, setError)
            fieldApiError('password', 'password', errors, setError)
            fieldApiError('password_retype', 'passwordRetype', errors, setError)
          }
        })}
      >
        <TextField
          type="text"
          register={register('username')}
          formState={formState}
          label="Username"
          placeholder="Unique username or email"
        />

        <TextField
          type="password"
          register={register('password')}
          formState={formState}
          label="Password"
          placeholder="Your new password"
        />

        <TextField
          type="password"
          register={register('passwordRetype')}
          formState={formState}
          label="Retype password"
          placeholder="Verify password"
        />

        <SubmitField>Sign up</SubmitField>
      </form>

      <FormFooter
        cta="Already have an account?"
        link="/login"
        title="Sign in"
      />
    </div>
  )
}
