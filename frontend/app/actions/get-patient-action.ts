'use server'

import type { Patient } from '@/types/api/models/Patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getPatient(patientId: string): Promise<Patient> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view patient details')
  }

  const api = await getApiClient(session)
  return api.patients.patientsRetrieve(patientId)
}
