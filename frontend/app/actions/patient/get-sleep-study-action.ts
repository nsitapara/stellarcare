'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches a sleep study record by ID from the API.
 * This is a server action that requires authentication.
 *
 * @param {string} id - The unique identifier of the sleep study
 * @returns {Promise<any>} The sleep study data from the API
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails with 'Failed to fetch sleep study'
 *
 * @example
 * try {
 *   const sleepStudy = await getSleepStudy("123");
 *   // Handle sleep study data
 * } catch (error) {
 *   // Handle error
 * }
 */
export async function getSleepStudy(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/sleep-studies/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching sleep study:', error)
    throw new Error('Failed to fetch sleep study')
  }
}
