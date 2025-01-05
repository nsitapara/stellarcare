import type { Appointment } from '@/types/api/models/Appointment'
import type { Insurance } from '@/types/api/models/Insurance'
import type { Study } from '@/types/api/models/Study'
import type { Treatment } from '@/types/api/models/Treatment'

export type CustomField = {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
  customFieldDefinitionId: number
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
  customFields: CustomField[]
  studies: Study[]
  treatments: Treatment[]
  insurance: Insurance[]
  appointments: Appointment[]
}
