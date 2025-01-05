/**
 * Represents the structure of patient data required for creation and updates
 * @interface PatientFormData
 */
export interface PatientFormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  addresses: Array<{
    street: string
    city: string
    state: string
    zipCode: string
  }>
  customFields: FormCustomField[]
}

/**
 * Represents a custom field for patient data
 * @interface FormCustomField
 */
export interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
  customFieldDefinitionId: number
}
