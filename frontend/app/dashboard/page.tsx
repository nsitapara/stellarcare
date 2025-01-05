import type { PaginatedPatientList } from '@/types/api/models/PaginatedPatientList'
import type { Patient } from '@/types/api/models/Patient'
import { DashboardClient } from '@components/dashboard/dashboard-client'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

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

type DashboardData = {
  data: TransformedPatient[]
  total: number
  page: number
  pageSize: number
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const api = await getApiClient(session)
  const initialData: PaginatedPatientList = await api.patients.patientsList()

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
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardClient initialData={dashboardData} />
      </Suspense>
    </div>
  )
}
