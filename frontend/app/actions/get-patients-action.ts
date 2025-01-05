'use server'

import type { PaginatedPatientList } from '@/types/api/models/PaginatedPatientList'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getPatients(
  page: number,
  pageSize: number
): Promise<PaginatedPatientList> {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error('Unauthorized')
  }

  try {
    const api = await getApiClient(session)
    return await api.patients.patientsList(page, pageSize)
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw new Error('Failed to fetch patients')
  }
}
