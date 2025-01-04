'use client'

import type { Patient } from '@/types/api/models/Patient'
import type { PaginatedResponse } from '@/types/dashboard'
import { Button } from '@components/ui/button'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { DashboardTable } from './dashboard-table'

interface DashboardClientProps {
  initialData: PaginatedResponse
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter()
  const [data, setData] = useState<PaginatedResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching data for page:', page, 'pageSize:', pageSize)
      const response = await fetch(
        `/api/patients?page=${page}&page_size=${pageSize}`,
        {
          // Add cache control headers
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache'
          },
          // Add timestamp to prevent browser caching
          cache: 'no-store'
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const result = await response.json()
      console.log('Received data:', result)

      // Check if the data is different from current state
      const newData = {
        data: result.results.map((patient: Patient) => ({
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
        total: result.count,
        page,
        pageSize
      }

      setData(newData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load patient data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePageChange = (page: number) => {
    console.log('Page change requested:', page)
    fetchData(page, data.pageSize)
  }

  const handlePageSizeChange = (pageSize: number) => {
    console.log('Page size change requested:', pageSize)
    fetchData(1, pageSize)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Patient Management Dashboard
          </h2>
          <p className="text-muted-foreground">
            Efficiently manage and track your patient data
          </p>
        </div>
        <Button onClick={() => router.push('/patients/new')}>
          Add New Patient
        </Button>
      </div>

      {loading && data.data.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          Loading...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[200px] text-red-500">
          {error}
        </div>
      ) : (
        <DashboardTable
          data={data.data}
          total={data.total}
          page={data.page}
          pageSize={data.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
