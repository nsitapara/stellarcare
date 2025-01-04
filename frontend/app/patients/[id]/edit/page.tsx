'use client'

import { PatientForm } from '@/app/components/PatientForm'
import type { Patient } from '@/types/api/models/Patient'
import type { PatientFormData } from '@/types/patient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface EditPatientPageProps {
  params: {
    id: string
  }
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPatient() {
      try {
        const response = await fetch(`/api/patients/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to load patient')
        }
        const patientData = await response.json()
        setPatient(patientData)
      } catch (error) {
        console.error('Failed to load patient:', error)
        setError('Failed to load patient data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [params.id])

  async function handleSubmit(formData: PatientFormData) {
    try {
      if (!patient) return

      const response = await fetch('/api/patients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: params.id,
          first: formData.firstName,
          middle: formData.middleName || null,
          last: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          status: patient.status,
          created_at: patient.created_at,
          modified_at: patient.modified_at,
          addresses: formData.addresses.map((addr) => ({
            id: 0,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zip_code: addr.zipCode,
            formatted_address: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`
          })),
          custom_fields: patient.custom_fields,
          studies: patient.studies,
          treatments: patient.treatments,
          insurance: patient.insurance,
          appointments: patient.appointments
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update patient')
      }

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

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[200px]">
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-10">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          Patient not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Patient</h1>
        <p className="text-muted-foreground">Update patient information</p>
      </div>
      <PatientForm
        onSubmit={handleSubmit}
        initialData={{
          id: patient.id,
          firstName: patient.first,
          middleName: patient.middle || '',
          lastName: patient.last,
          dateOfBirth: patient.date_of_birth,
          status: patient.status,
          addresses: patient.addresses.map((addr) => ({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zip_code
          })),
          customFields: [],
          sleepStudies: [],
          medications: [],
          cpapUsage: [],
          insurance: [],
          appointments: [],
          createdAt: patient.created_at,
          modifiedAt: patient.modified_at
        }}
      />
    </div>
  )
}
