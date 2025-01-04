'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function searchPatients(query: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('Unauthorized')
    }

    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: '/api/patients/search/',
      query: {
        q: query
      }
    })

    return response
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}
