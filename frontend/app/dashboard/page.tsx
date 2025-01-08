import { getPatients } from '@actions/patient/get-patients-action'
import { DashboardClient } from '@components/dashboard/dashboard-client'
import { authOptions } from '@lib/auth'
import type { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard - StellarCare',
  description: 'Manage your patients and appointments'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1
}

/**
 * Server-side rendered dashboard page component.
 * Handles authentication, initial data fetching, and patient data processing.
 *
 * Features:
 * - Authentication check with automatic redirect to login if unauthenticated
 * - Fetches initial patient data (5 patients per page)
 * - Processes patient data to include formatted addresses and default values
 * - Error handling with fallback to empty dashboard state
 *
 * @returns The DashboardClient component with processed patient data or empty state
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  try {
    const initialData = await getPatients(1, 5)
    const dashboardData = {
      data: initialData.results.map((patient) => ({
        id: String(patient.id),
        first: patient.first || '',
        middle: patient.middle || '',
        last: patient.last || '',
        status: patient.status || '',
        date_of_birth: patient.date_of_birth || '',
        created_at: patient.created_at || '',
        addresses:
          patient.addresses?.map((addr) => addr.formatted_address) || [],
        customFields:
          patient.patient_custom_fields?.map((field) => ({
            name: field.field_definition.name,
            value: field.value
          })) || []
      })),
      total: initialData.count,
      page: 1,
      pageSize: 5
    }

    return <DashboardClient initialData={dashboardData} />
  } catch (error) {
    console.error('Error fetching initial data:', error)
    return (
      <DashboardClient
        initialData={{ data: [], total: 0, page: 1, pageSize: 5 }}
      />
    )
  }
}
