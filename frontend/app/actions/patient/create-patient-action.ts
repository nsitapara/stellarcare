'use server'

import type { Address } from '@api/models/Address'
import type { Patient } from '@api/models/Patient'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { PatientFormData } from '@types/patient'
import { getServerSession } from 'next-auth'

interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
  customFieldDefinitionId: number
}

export async function createPatient(
  formData: Omit<PatientFormData, 'customFields'> & {
    customFields: FormCustomField[]
  }
) {
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
        custom_field_definition_id: field.customFieldDefinitionId,
        type: field.type,
        value_text: field.type === 'text' ? String(field.value) : null,
        value_number: field.type === 'number' ? Number(field.value) : null
      })),
      studies: [],
      treatments: [],
      insurance: [],
      appointments: []
    }

    const response = await api.request.request<Patient>({
      method: 'POST',
      url: '/api/patients/',
      body: createData
    })
    return response
  } catch (error) {
    console.error('Error in createPatient:', error)
    throw error
  }
}
