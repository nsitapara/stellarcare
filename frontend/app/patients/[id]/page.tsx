/**
 * Patient Details Page
 *
 * This page displays detailed information about a single patient.
 * It handles:
 * - Authentication checks
 * - Patient data fetching
 * - Redirection for unauthorized access or missing patients
 */

import { getPatient } from '@actions/patient/get-patient-action'
import { PatientHeader } from '@components/patients/patient-header'
import { PatientTabs } from '@components/patients/patient-tabs'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface PatientPageProps {
  params: Promise<{
    id: string // Patient ID from the URL
  }>
}

export default async function PatientPage({ params }: PatientPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  // Wait for params to be available
  const { id } = await params

  // Fetch patient data
  const patient = await getPatient(id)
  if (!patient) {
    redirect('/dashboard')
  }

  return (
    <div className="container-wrapper">
      <div className="space-y-2">
        <PatientHeader />
        <div className="form-card">
          <PatientTabs patient={patient} />
        </div>
      </div>
    </div>
  )
}
