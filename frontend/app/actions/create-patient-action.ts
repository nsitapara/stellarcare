'use server'

import type { Address } from '@/types/api/models/Address'
import type { Patient } from '@/types/api/models/Patient'
import type { PatientFormData } from '@/types/patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

interface CustomFieldResponse {
  id: number
  name: string
  type: string
  value_text: string | null
  value_number: number | null
}

export async function createPatient(formData: PatientFormData) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to create a patient')
  }

  const api = await getApiClient(session)

  // Create custom fields first
  const customFieldsPromises =
    formData.customFields?.map(async (field) => {
      const response = await api.request.request<CustomFieldResponse>({
        method: 'POST',
        url: '/api/custom-fields/',
        body: {
          name: field.name,
          type: field.type,
          value_text: field.type === 'text' ? field.value : null,
          value_number: field.type === 'number' ? Number(field.value) : null
        }
      })
      return response.id
    }) || []

  const customFieldIds = await Promise.all(customFieldsPromises)

  // Create patient with the custom field IDs
  return await api.patients.patientsCreate({
    first: formData.firstName,
    middle: formData.middleName || null,
    last: formData.lastName,
    date_of_birth: formData.dateOfBirth,
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
    status: 'Inquiry',
    custom_fields: customFieldIds,
    studies: [],
    treatments: [],
    insurance: [],
    appointments: []
  } as unknown as Patient)
}
