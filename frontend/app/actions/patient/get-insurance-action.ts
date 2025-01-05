'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches insurance information by ID from the API.
 * This is a server action that requires authentication.
 *
 * @param {string} id - The unique identifier of the insurance record
 * @returns {Promise<any>} The insurance data from the API
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails with 'Failed to fetch insurance'
 *
 * @example
 * try {
 *   const insurance = await getInsurance("123");
 *   // Handle insurance data
 * } catch (error) {
 *   // Handle error
 * }
 */
export async function getInsurance(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/insurance/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching insurance:', error)
    throw new Error('Failed to fetch insurance')
  }
}
