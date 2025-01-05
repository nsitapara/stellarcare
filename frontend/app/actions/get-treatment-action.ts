'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getTreatment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/treatments/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching treatment:', error)
    throw new Error('Failed to fetch treatment')
  }
}
