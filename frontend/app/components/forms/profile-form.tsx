'use client'

import type { UserCurrent } from '@/types/api'
import type { profileAction } from '@actions/profile-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { fieldApiError } from '@lib/forms'
import { profileFormSchema } from '@lib/validation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { FormHeader } from '..//forms/form-header'
import { SubmitField } from '..//forms/submit-field'
import { TextField } from '..//forms/text-field'
import { SuccessMessage } from '..//messages/success-message'

export type ProfileFormSchema = z.infer<typeof profileFormSchema>

export function ProfileForm({
  currentUser,
  onSubmitHandler
}: {
  currentUser: Promise<UserCurrent>
  onSubmitHandler: typeof profileAction
}) {
  const [success, setSuccess] = useState<boolean>(false)

  const { formState, handleSubmit, register, setError } =
    useForm<ProfileFormSchema>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: async () => {
        const user = await currentUser

        return {
          firstName: user.first_name || '',
          lastName: user.last_name || ''
        }
      }
    })

  return (
    <>
      <FormHeader
        title="Update you profile information"
        description="Change your account data"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res !== true && typeof res !== 'boolean') {
            setSuccess(false)

            fieldApiError('first_name', 'firstName', res, setError)
            fieldApiError('last_name', 'lastName', res, setError)
          } else {
            setSuccess(true)
          }
        })}
      >
        {success && (
          <SuccessMessage>Profile has been succesfully updated</SuccessMessage>
        )}

        <TextField
          type="text"
          register={register('firstName')}
          label="First name"
          formState={formState}
        />

        <TextField
          type="text"
          register={register('lastName')}
          label="Last name"
          formState={formState}
        />

        <SubmitField isLoading={formState.isLoading}>
          Update profile
        </SubmitField>
      </form>
    </>
  )
}
