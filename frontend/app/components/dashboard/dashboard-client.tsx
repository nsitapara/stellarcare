'use client'

import type { Patient } from '@/types/api/models/Patient'
import type { PaginatedResponse } from '@/types/dashboard'
import { Button } from '@components/ui/button'
import { useCallback, useState } from 'react'
import { DashboardTable } from './dashboard-table'

interface DashboardClientProps {
  initialData: PaginatedResponse
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<PaginatedResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `/api/patients?page=${page}&pageSize=${pageSize}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const result = await response.json()
      setData({
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
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load patient data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePageChange = (page: number) => {
    fetchData(page, data.pageSize)
  }

  const handlePageSizeChange = (pageSize: number) => {
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
        <Button>Add New Patient</Button>
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
