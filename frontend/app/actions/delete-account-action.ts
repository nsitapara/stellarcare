'use server'

import { ApiError } from '@/types/api'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { deleteAccountFormSchema } from '@lib/validation'
import { getServerSession } from 'next-auth'
import type { z } from 'zod'

export type DeleteAccountFormSchema = z.infer<typeof deleteAccountFormSchema>

export async function deleteAccountAction(
  data: DeleteAccountFormSchema
): Promise<boolean> {
  const session = await getServerSession(authOptions)

  try {
    const apiClient = await getApiClient(session)

    if (session !== null) {
      await apiClient.users.usersDeleteAccountDestroy()

      return true
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return false
    }
  }

  return false
}
