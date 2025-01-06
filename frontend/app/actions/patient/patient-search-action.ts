'use server'

import type { Patient } from '@api/models/Patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Server action for searching patients by name or ID
 *
 * @param query - Search query (name or ID)
 * @returns Array of matching patients
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const patients = await searchPatients("John");
 *   // Handle search results
 * } catch (error) {
 *   // Handle error
 * }
 */
export async function searchPatients(query: string): Promise<Patient[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to search patients')
  }

  try {
    const api = await getApiClient(session)
    const searchParams = new URLSearchParams({ q: query })
    const response = await api.request.request<Patient[]>({
      method: 'GET',
      url: `/api/patients/search/?${searchParams.toString()}`
    })
    return response
  } catch (error) {
    console.error('Failed to search patients:', error)
    throw error
  }
}
