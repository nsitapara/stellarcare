export interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number | null
  customFieldDefinitionId?: number
}

export interface PatientFormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  addresses: {
    street: string
    city: string
    state: string
    zipCode: string
  }[]
  customFields: FormCustomField[]
}
