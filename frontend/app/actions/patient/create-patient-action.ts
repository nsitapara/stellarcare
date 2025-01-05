'use server'

import type { Address } from '@api/models/Address'
import type { Patient } from '@api/models/Patient'
import type { FormCustomField, PatientFormData } from '@api/patient/form'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Creates a new patient record in the system with the provided information.
 * This is a server action that requires authentication.
 *
 * @param {Omit<PatientFormData, 'customFields'> & { customFields: FormCustomField[] }} formData - The patient data to create
 * @returns {Promise<Patient>} The created patient data from the API
 * @throws {Error} If the user is not authenticated
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const patientData = {
 *     firstName: "John",
 *     lastName: "Doe",
 *     dateOfBirth: "1990-01-01",
 *     addresses: [{
 *       street: "123 Main St",
 *       city: "Anytown",
 *       state: "CA",
 *       zipCode: "12345"
 *     }],
 *     customFields: []
 *   };
 *   const patient = await createPatient(patientData);
 *   // Handle created patient
 * } catch (error) {
 *   // Handle error
 * }
 */
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
