'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches a treatment record by ID from the API.
 * This is a server action that requires authentication.
 *
 * @param {string} id - The unique identifier of the treatment
 * @returns {Promise<any>} The treatment data from the API
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails with 'Failed to fetch treatment'
 *
 * @example
 * try {
 *   const treatment = await getTreatment("123");
 *   // Handle treatment data
 * } catch (error) {
 *   // Handle error
 * }
 */
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
