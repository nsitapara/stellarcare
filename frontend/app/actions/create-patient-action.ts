'use server'

import type { Address } from '@/types/api/models/Address'
import type { Patient } from '@/types/api/models/Patient'
import { StatusEnum } from '@/types/api/models/StatusEnum'
import type { PatientFormData } from '@/types/patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function createPatient(formData: PatientFormData) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to create a patient')
  }

  const api = await getApiClient(session)
  return api.patients.patientsCreate({
    first: formData.firstName,
    middle: formData.middleName || null,
    last: formData.lastName,
    date_of_birth: formData.dateOfBirth,
    status: StatusEnum.INQUIRY,
    addresses: formData.addresses.map(
      (addr) =>
        ({
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zip_code: addr.zipCode,
          formatted_address:
            `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`.trim()
        }) as Address
    ),
    custom_fields: [],
    studies: [],
    treatments: [],
    insurance: [],
    appointments: [],
    id: undefined,
    created_at: undefined,
    modified_at: undefined
  } as unknown as Patient)
}
