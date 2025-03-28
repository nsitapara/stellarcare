'use client'

import { createPatient } from '@actions/patient/create-patient-action'
import type { PatientFormData } from '@api/patient/form'
import { PatientForm } from '@components/forms/patient-form'
import { Button } from '@components/ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * New Patient Page Component
 * Provides a form interface for creating new patient records.
 *
 * Features:
 * - Clean form for entering new patient information
 * - Handles form submission and patient creation
 * - Validates required fields
 * - Supports redirect after successful creation
 * - Includes error handling and display
 * - Responsive layout with close button
 *
 * @returns A form interface for creating new patients
 */
export default function NewPatientPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: PatientFormData) {
    try {
      if (!formData.dateOfBirth) {
        setError('Date of birth is required')
        return
      }

      await createPatient(formData)
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
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8 px-6">
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
