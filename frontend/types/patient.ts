export type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned'

export type CustomField = {
  name: string
  type: 'text' | 'number'
  value: string | number
}

export type SleepStudy = {
  id: string
  date: string
  ahi: number
  sleepEfficiency: number
  remLatency: number
  notes: string
  fileUrl?: string
}

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

export type CPAPUsage = {
  id: string
  date: string
  hoursUsed: number
  eventsPerHour: number
  maskLeak: number
  notes?: string
}

export type Insurance = {
  id: string
  provider: string
  policyNumber: string
  groupNumber: string
  primaryHolder: string
  relationship: string
  authorizationStatus?: string
  authorizationExpiry?: string
}

export type Appointment = {
  id: string
  date: string
  time: string
  type: 'In-Person' | 'Telehealth'
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show'
  notes?: string
  zoomLink?: string
}

export type Patient = {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  status: PatientStatus
  addresses: Address[]
  customFields: CustomField[]
  sleepStudies: SleepStudy[]
  medications: Medication[]
  cpapUsage: CPAPUsage[]
  insurance: Insurance[]
  appointments: Appointment[]
}
