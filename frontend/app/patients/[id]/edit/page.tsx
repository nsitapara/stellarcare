'use client'

import { getPatient } from '@/app/actions/get-patient-action'
import { updatePatient } from '@/app/actions/update-patient-action'
import { PatientForm } from '@/app/components/PatientForm'
import { Button } from '@/app/components/ui/button'
import type { Patient } from '@/types/api/models/Patient'
import type { PatientFormData } from '@/types/patient'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'

interface CustomField {
  id: number
  name: string
  type: 'text' | 'number'
  value_text: string | null
  value_number: number | null
}

interface FormCustomField {
  name: string
  type: 'text' | 'number'
  value: string | number
}

interface PatientFormDataWithCustomFields
  extends Omit<PatientFormData, 'customFields'> {
  customFields: FormCustomField[]
}

interface PatientWithCustomFields extends Omit<Patient, 'custom_fields'> {
  custom_fields: CustomField[]
}

export default function EditPatientPage({
  params
}: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [patient, setPatient] =
    useState<PatientFormDataWithCustomFields | null>(null)
  const [originalPatient, setOriginalPatient] = useState<Patient | null>(null)
  const { id: patientId } = use(params)

  useEffect(() => {
    async function loadPatient() {
      try {
        const response = (await getPatient(
          patientId
        )) as unknown as PatientWithCustomFields
        setOriginalPatient(response as unknown as Patient)
        setPatient({
          firstName: response.first,
          middleName: response.middle || undefined,
          lastName: response.last,
          dateOfBirth: response.date_of_birth,
          addresses: response.addresses.map((addr) => ({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zip_code
          })),
          customFields: (response.custom_fields || []).map((field) => ({
            name: field.name,
            type: field.type,
            value:
              field.type === 'text'
                ? field.value_text || ''
                : field.value_number || 0
          })),
          studies: response.studies,
          treatments: response.treatments,
          insurance: response.insurance,
          appointments: response.appointments
        } as PatientFormDataWithCustomFields)
      } catch (error) {
        console.error('Failed to load patient:', error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Failed to load patient. Please try again.')
        }
      }
    }
    loadPatient()
  }, [patientId])

  async function handleSubmit(formData: PatientFormDataWithCustomFields) {
    try {
      if (!originalPatient) {
        setError('Original patient data not found')
        return
      }

      await updatePatient(
        patientId,
        formData as PatientFormData,
        originalPatient
      )
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to update patient:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to update patient. Please try again.')
      }
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8 px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Edit Patient
          </h1>
          <p className="text-sm text-muted-foreground">
            Update patient information
          </p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => router.push('/dashboard')}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md whitespace-pre-line">
          {error}
        </div>
      )}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        {patient && (
          <PatientForm onSubmit={handleSubmit} initialData={patient} />
        )}
      </div>
    </div>
  )
}
