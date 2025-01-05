/**
 * Patient Data Server Actions
 *
 * This module provides server-side actions for fetching patient data.
 * It handles authentication checks and error handling for patient-related operations.
 */

'use server'

import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { Patient } from '@types/api/models/Patient'
import { getServerSession } from 'next-auth'

/**
 * Fetches a single patient's details by ID
 *
 * @param id - The patient's ID
 * @returns The patient object if found and user is authenticated, null otherwise
 */
export async function getPatient(id: string): Promise<Patient | null> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return null
  }

  try {
    const api = await getApiClient(session)
    return await api.patients.patientsRetrieve(id)
  } catch (error) {
    console.error('Failed to fetch patient:', error)
    return null
  }
}
