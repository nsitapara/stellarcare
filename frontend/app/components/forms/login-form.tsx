'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
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

  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmitHandler = handleSubmit((data) => {
    signIn('credentials', {
      username: data.username,
      password: data.password,
      callbackUrl: '/dashboard'
    })
  })

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <FormHeader
        title="Welcome back to StellarCare"
        description="Sign in to access your dashboard"
      />

      {search.has('error') && search.get('error') === 'CredentialsSignin' && (
        <ErrorMessage>Invalid username or password.</ErrorMessage>
      )}

      <form
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={onSubmitHandler}
        className="space-y-6"
      >
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
        >
          Sign in
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
