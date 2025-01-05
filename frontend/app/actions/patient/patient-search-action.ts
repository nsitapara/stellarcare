'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Searches for patients using a query string.
 * This is a server action that requires authentication.
 *
 * @param {string} query - The search query to find patients
 * @returns {Promise<any>} The search results from the API
 * @throws {Error} If user is not authenticated with message 'Unauthorized'
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const results = await searchPatients("John Doe");
 *   // Handle search results
 * } catch (error) {
 *   // Handle error
 * }
 */
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
