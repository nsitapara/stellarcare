'use client'

import { getPatient } from '@actions/patient/get-patient-action'
import { getPatientCustomFields } from '@actions/patient/get-patient-custom-fields-action'
import { updatePatient } from '@actions/patient/update-patient-action'
import { PatientForm } from '@components/PatientForm'
import { Button } from '@components/ui/button'
import type { Patient } from '@types/api/models/Patient'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
  customFieldDefinitionId: number
}

interface FormData {
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

interface PatientWithCustomFields extends Patient {
  customFields: FormCustomField[]
}

export default function EditPatientPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [patient, setPatient] = useState<PatientWithCustomFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = use(params)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        const patientData = await getPatient(id)

        // Fetch patient's custom field values
        const customFields = await getPatientCustomFields(Number(id))

        // Transform custom fields to match form data structure
        const formattedCustomFields = customFields.map((field) => ({
          id: crypto.randomUUID(),
          name: field.field_definition.name,
          type: field.field_definition.type as 'text' | 'number',
          value: field.value,
          customFieldDefinitionId: field.field_definition.id
        }))

        // Merge patient data with custom fields
        const patientWithCustomFields: PatientWithCustomFields = {
          ...patientData,
          customFields: formattedCustomFields
        }

        setPatient(patientWithCustomFields)
        setError(null)
      } catch (err) {
        console.error('Error fetching patient:', err)
        setError('Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [id])

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!patient) return

      await updatePatient(
        id,
        {
          ...formData,
          customFields: formData.customFields
        },
        patient
      )

      // Get the redirect path from the URL query parameters
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') || '/patients'
      router.push(redirectPath)
    } catch (error) {
      console.error('Error updating patient:', error)
    }
  }

  if (loading) {
    return (
      <div className="container-wrapper py-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-wrapper py-8">
        <div className="p-4 text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container-wrapper py-8">
        <div className="p-4 text-muted-foreground bg-muted rounded-md">
          Patient not found
        </div>
      </div>
    )
  }

  const initialData: FormData = {
    firstName: patient.first,
    middleName: patient.middle || undefined,
    lastName: patient.last,
    dateOfBirth: patient.date_of_birth,
    addresses: patient.addresses.map((addr) => ({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code
    })),
    customFields: patient.customFields
  }

  return (
    <div className="container-wrapper py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Patient</h2>
            <p className="text-muted-foreground">
              Update patient information and details
            </p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search)
              const redirectPath = searchParams.get('redirect') || '/dashboard'
              router.push(redirectPath)
            }}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="form-card">
          <PatientForm onSubmit={handleSubmit} initialData={initialData} />
        </div>
      </div>
    </div>
  )
}
