'use server'

import type { Address } from '@api/models/Address'
import type { Patient } from '@api/models/Patient'
import type { FormCustomField, PatientFormData } from '@api/patient/form'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Updates an existing patient's information in the system.
 * This is a server action that requires authentication.
 *
 * @param {string} patientId - The unique identifier of the patient to update
 * @param {Omit<PatientFormData, 'customFields'> & { customFields: FormCustomField[] }} formData - The updated patient data
 * @param {Patient} originalPatient - The original patient data before updates
 * @returns {Promise<Patient>} The updated patient data from the API
 * @throws {Error} If user is not authenticated with message 'You must be logged in to update a patient'
 * @throws {Error} If the API request fails
 *
 * @example
 * try {
 *   const updatedPatient = await updatePatient("123", {
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
 *   }, originalPatient);
 *   // Handle updated patient
 * } catch (error) {
 *   // Handle error
 * }
 */
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
