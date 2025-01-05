'use client'

import { getPatient } from '@/app/actions/get-patient-action'
import { getPatientCustomFields } from '@/app/actions/get-patient-custom-fields-action'
import { updatePatient } from '@/app/actions/update-patient-action'
import { PatientForm } from '@/app/components/PatientForm'
import { Button } from '@/app/components/ui/button'
import type { Patient } from '@/types/api/models/Patient'
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
        console.log('Patient data:', patientData)

        // Fetch patient's custom field values
        const customFields = await getPatientCustomFields(Number(id))
        console.log('Patient custom fields:', customFields)

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
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!patient) {
    return <div>Patient not found</div>
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Patient</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search)
            const redirectPath = searchParams.get('redirect') || '/dashboard'
            router.push(redirectPath)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <PatientForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  )
}
