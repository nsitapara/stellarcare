'use client'

import { PatientForm } from '@/app/components/PatientForm'
import { Button } from '@/app/components/ui/button'
import { StatusEnum } from '@/types/api/models/StatusEnum'
import type { PatientFormData } from '@/types/patient'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewPatientPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: PatientFormData) {
    try {
      console.log('Submitting form data:', formData)

      // Format date to YYYY-MM-DD
      const dateOfBirth = formData.dateOfBirth
      if (!dateOfBirth) {
        setError('Date of birth is required')
        return
      }

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: '',
          first: formData.firstName || '',
          middle: formData.middleName || null,
          last: formData.lastName || '',
          date_of_birth: dateOfBirth,
          status: StatusEnum.INQUIRY,
          addresses: formData.addresses.map((addr) => ({
            id: 0,
            street: addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            zip_code: addr.zipCode || '',
            formatted_address: addr.street
              ? `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`.trim()
              : ''
          })),
          custom_fields: [],
          studies: [],
          treatments: [],
          insurance: [],
          appointments: []
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)

        // Format validation errors into a readable message
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
            )
            .join('\n')
          throw new Error(errorMessages)
        }

        throw new Error(errorData.error || 'Failed to create patient')
      }

      const result = await response.json()
      console.log('Patient created:', result)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create patient:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to create patient. Please try again.')
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Add New Patient
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new patient record
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
        <PatientForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
