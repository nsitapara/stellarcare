'use server'

import type { Address } from '@/types/api/models/Address'
import type { Patient } from '@/types/api/models/Patient'
import type { PatientFormData } from '@/types/patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function createPatient(formData: PatientFormData) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to create a patient')
  }

  try {
    const api = await getApiClient(session)

    // Create patient with custom fields
    const createData = {
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
      custom_fields: (formData.customFields || []).map((field) => ({
        name: field.name,
        type: field.type,
        value_text: field.type === 'text' ? field.value : null,
        value_number: field.type === 'number' ? Number(field.value) : null
      })),
      studies: [],
      treatments: [],
      insurance: [],
      appointments: []
    }

    console.log('Create data:', createData)

    const response = await api.request.request<Patient>({
      method: 'POST',
      url: '/api/patients/',
      body: createData
    })
    console.log('Create response:', response)
    return response
  } catch (error) {
    console.error('Error in createPatient:', error)
    throw error
  }
}
