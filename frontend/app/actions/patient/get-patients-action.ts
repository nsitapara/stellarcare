'use server'

import type { PaginatedPatientList } from '@api/models/PaginatedPatientList'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Server action to fetch paginated list of patients.
 * Uses the auto-generated API client to maintain type safety with the backend.
 *
 * @param page - The page number to fetch (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Promise<PaginatedPatientList> - Returns a paginated list of patients with count and results
 * @throws Error if user is not authenticated or if the API request fails
 */
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
    // Ensure page is at least 1
    const safePage = Math.max(1, page)
    return await api.patients.patientsList(safePage, pageSize)
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw new Error('Failed to fetch patients')
  }
}
