'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { loginFormSchema } from '../../lib/validation'
import { FormFooter } from '../forms/form-footer'
import { FormHeader } from '../forms/form-header'
import { SubmitField } from '../forms/submit-field'
import { TextField } from '../forms/text-field'
import { ErrorMessage } from '../messages/error-message'

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
      callbackUrl: '/'
    })
  })

  return (
    <>
      <FormHeader
        title="Welcome back to Turbo"
        description="Get an access to internal application"
      />

      {search.has('error') && search.get('error') === 'CredentialsSignin' && (
        <ErrorMessage>Provided account does not exists.</ErrorMessage>
      )}

      <form
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={onSubmitHandler}
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

        <SubmitField>Sign in</SubmitField>
      </form>

      <FormFooter
        cta="Don't have an account?"
        link="/register"
        title="Sign up"
      />
    </>
  )
}
