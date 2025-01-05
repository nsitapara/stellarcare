'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getAppointment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/appointments/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching appointment:', error)
    throw new Error('Failed to fetch appointment')
  }
}
