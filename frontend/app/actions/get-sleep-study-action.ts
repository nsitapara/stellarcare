'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getSleepStudy(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/sleep-studies/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching sleep study:', error)
    throw new Error('Failed to fetch sleep study')
  }
}
