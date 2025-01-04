import { DashboardClient } from '@components/dashboard/dashboard-client'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import type { Patient } from '@types/api/models/Patient'
import { getServerSession } from 'next-auth'
import { Suspense } from 'react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const api = await getApiClient(session)

  const initialData = await api.patients.patientsList(1, 10)

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardClient
          initialData={{
            data: initialData.results.map((patient: Patient) => ({
              id: patient.id,
              first: patient.first || '',
              middle: patient.middle || '',
              last: patient.last || '',
              status: patient.status || '',
              date_of_birth: patient.date_of_birth || '',
              created_at: patient.created_at || '',
              addresses:
                patient.addresses?.map((addr) => addr.formatted_address) || []
            })),
            total: initialData.count,
            page: 1,
            pageSize: 10
          }}
        />
      </Suspense>
    </div>
  )
}
