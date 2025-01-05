'use server'

import type { PatientCustomField } from '@api/models/PatientCustomField'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getPatientCustomFields(
  patientId: number
): Promise<PatientCustomField[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view patient custom fields')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<PatientCustomField>
    >({
      method: 'GET',
      url: `/api/patients/${patientId}/custom-fields/`
    })
    return response.results
  } catch (error) {
    console.error('Failed to fetch patient custom fields:', error)
    throw error
  }
}
