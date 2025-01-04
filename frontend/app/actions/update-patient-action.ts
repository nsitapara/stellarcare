'use server'

import type { Address } from '@/types/api/models/Address'
import type { Patient } from '@/types/api/models/Patient'
import type { PatientFormData } from '@/types/patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function updatePatient(
  patientId: string,
  formData: PatientFormData,
  originalPatient: Patient
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to update a patient')
  }

  const api = await getApiClient(session)
  return api.patients.patientsUpdate(patientId, {
    first: formData.firstName,
    middle: formData.middleName || null,
    last: formData.lastName,
    date_of_birth: formData.dateOfBirth,
    addresses: formData.addresses.map(
      (addr) =>
        ({
          id: 0,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zip_code: addr.zipCode,
          formatted_address:
            `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`.trim()
        }) as Address
    ),
    status: originalPatient.status,
    custom_fields: originalPatient.custom_fields,
    studies: originalPatient.studies,
    treatments: originalPatient.treatments,
    insurance: originalPatient.insurance,
    appointments: originalPatient.appointments,
    id: originalPatient.id,
    created_at: originalPatient.created_at,
    modified_at: originalPatient.modified_at
  } as Patient)
}
