'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches a single appointment by its ID from the API.
 * This is a server action that requires authentication.
 *
 * @param {string} id - The unique identifier of the appointment to retrieve
 * @returns {Promise<any>} The appointment data from the API
 * @throws {Error} If the user is not authenticated
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const appointment = await getAppointment("123");
 *   // Handle appointment data
 * } catch (error) {
 *   // Handle error
 * }
 */
export async function getAppointment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request({
      method: 'GET',
      url: `/api/appointments/${id}/`
    })

    return response
  } catch (error) {
    console.error('Error fetching appointment:', error)
    throw new Error('Failed to fetch appointment')
  }
}
