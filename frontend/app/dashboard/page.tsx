import type { PaginatedPatientList } from '@/types/api/models/PaginatedPatientList'
import type { Patient } from '@/types/api/models/Patient'
import { DashboardClient } from '@components/dashboard/dashboard-client'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard - StellarCare',
  description: 'Patient Management Dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml'
      }
    ]
  }
}

/**
 * Type definition for transformed patient data displayed in the dashboard UI.
 * Converts numeric IDs to strings and ensures all optional fields have default values.
 */
type TransformedPatient = {
  id: string
  first: string
  middle: string
  last: string
  status: string
  date_of_birth: string
  created_at: string
  addresses: string[]
}

/**
 * Type definition for the dashboard's data structure.
 * Includes both the transformed patient data and pagination information.
 */
type DashboardData = {
  data: TransformedPatient[]
  total: number
  page: number
  pageSize: number
}

/**
 * Server Component for the main dashboard page.
 * Handles:
 * - Authentication check
 * - Initial data fetching
 * - Data transformation for the client component
 *
 * The component uses Suspense for loading states and redirects
 * unauthenticated users to the login page.
 */
export default async function DashboardPage() {
  // Check authentication status
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch initial patient data
  const api = await getApiClient(session)
  const initialData: PaginatedPatientList = await api.patients.patientsList()

  // Transform the data for the client component
  const dashboardData: DashboardData = {
    data: initialData.results.map((patient: Patient) => ({
      id: String(patient.id),
      first: patient.first || '',
      middle: patient.middle || '',
      last: patient.last || '',
      status: patient.status || '',
      date_of_birth: patient.date_of_birth || '',
      created_at: patient.created_at || '',
      addresses: patient.addresses?.map((addr) => addr.formatted_address) || []
    })),
    total: initialData.count,
    page: 1,
    pageSize: 10
  }

  return (
    <div className="container mx-auto">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <DashboardClient initialData={dashboardData} />
      </Suspense>
    </div>
  )
}
