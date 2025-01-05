'use client'

import type {
  RegisterFormSchema,
  registerAction
} from '@actions/user/register-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { fieldApiError } from '@lib/forms'
import { registerFormSchema } from '@lib/validation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { TextField } from '..//forms/text-field'
import { FormFooter } from '../forms/form-footer'
import { FormHeader } from '../forms/form-header'
import { SubmitField } from '../forms/submit-field'

export function RegisterForm({
  onSubmitHandler
}: { onSubmitHandler: typeof registerAction }) {
  const { formState, handleSubmit, register, setError } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema)
    })

  return (
    <>
      <FormHeader
        title="Create new account in Turbo"
        description="Get an access to internal application"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res === true) {
            signIn()
          } else if (typeof res !== 'boolean') {
            fieldApiError('username', 'username', res, setError)
            fieldApiError('password', 'password', res, setError)
            fieldApiError('password_retype', 'passwordRetype', res, setError)
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
    </>
  )
}
