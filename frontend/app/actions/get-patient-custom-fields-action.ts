'use server'

import type { PatientCustomField } from '@/types/api/models/PatientCustomField'
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
    console.log('Fetching custom fields for patient:', patientId)
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<PatientCustomField>
    >({
      method: 'GET',
      url: `/api/patients/${patientId}/custom-fields/`
    })
    console.log('Patient custom fields API response:', response)
    return response.results
  } catch (error) {
    console.error('Error fetching patient custom fields:', error)
    throw error
  }
}
