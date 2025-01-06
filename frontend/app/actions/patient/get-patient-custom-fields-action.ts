'use server'

import type { PaginatedResponse } from '@api/common/pagination'
import type { PatientCustomField } from '@api/models/PatientCustomField'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches custom fields associated with a specific patient.
 * This is a server action that requires authentication.
 *
 * @param {number} patientId - The unique identifier of the patient
 * @returns {Promise<PatientCustomField[]>} Array of custom fields associated with the patient
 * @throws {Error} If user is not authenticated with message 'You must be logged in to view patient custom fields'
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const customFields = await getPatientCustomFields(123);
 *   // Handle custom fields data
 * } catch (error) {
 *   // Handle error
 * }
 */
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
