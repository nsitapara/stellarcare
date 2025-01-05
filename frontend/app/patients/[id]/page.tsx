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
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { PatientTabs } from './patient-tabs'

interface PatientPageProps {
  params: {
    id: string // Patient ID from the URL
  }
}

export default async function PatientPage({ params }: PatientPageProps) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  // Fetch patient data
  const patient = await getPatient(params.id)
  if (!patient) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-6">
      <PatientTabs patient={patient} />
    </div>
  )
}
