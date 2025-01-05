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

export async function updatePatient(
  patientId: string,
  formData: Omit<PatientFormData, 'customFields'> & {
    customFields: FormCustomField[]
  },
  originalPatient: Patient
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to update a patient')
  }

  try {
    const api = await getApiClient(session)

    // Update patient with custom fields
    const updateData = {
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
      status: originalPatient.status,
      custom_fields: (formData.customFields || []).map((field) => ({
        custom_field_definition_id: field.customFieldDefinitionId,
        type: field.type,
        value_text: field.type === 'text' ? String(field.value) : null,
        value_number: field.type === 'number' ? Number(field.value) : null
      })),
      studies: originalPatient.studies,
      treatments: originalPatient.treatments,
      insurance: originalPatient.insurance,
      appointments: originalPatient.appointments
    }

    const response = await api.request.request<Patient>({
      method: 'PUT',
      url: `/api/patients/${patientId}/`,
      body: updateData
    })
    return response
  } catch (error) {
    console.error('Error in updatePatient:', error)
    throw error
  }
}
