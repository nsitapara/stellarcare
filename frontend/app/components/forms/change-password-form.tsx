'use client'

import type { changePasswordAction } from '@actions/change-password-action'
import { FormHeader } from '@components/forms/form-header'
import { SubmitField } from '@components/forms/submit-field'
import { TextField } from '@components/forms/text-field'
import { SuccessMessage } from '@components/messages/success-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { fieldApiError } from '@lib/forms'
import { changePasswordFormSchema } from '@lib/validation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

export type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>

export function ChangePaswordForm({
  onSubmitHandler
}: {
  onSubmitHandler: typeof changePasswordAction
}) {
  const [success, setSuccess] = useState<boolean>(false)

  const { formState, handleSubmit, register, reset, setError } =
    useForm<ChangePasswordFormSchema>({
      resolver: zodResolver(changePasswordFormSchema)
    })

  return (
    <>
      <FormHeader
        title="Set new account password"
        description="Change sign in access password"
      />

      {success && (
        <SuccessMessage>Password has been successfully changed</SuccessMessage>
      )}

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res !== true && typeof res !== 'boolean') {
            setSuccess(false)
            fieldApiError('password', 'password', res, setError)
            fieldApiError('password_new', 'passwordNew', res, setError)
            fieldApiError('password_retype', 'passwordRetype', res, setError)
          } else {
            reset()
            setSuccess(true)
          }
        })}
      >
        <TextField
          type="text"
          register={register('password')}
          label="Current password"
          formState={formState}
        />

        <TextField
          type="text"
          register={register('passwordNew')}
          label="New password"
          formState={formState}
        />

        <TextField
          type="text"
          register={register('passwordRetype')}
          label="Retype password"
          formState={formState}
        />

        <SubmitField isLoading={formState.isLoading}>
          Change password
        </SubmitField>
      </form>
    </>
  )
}
