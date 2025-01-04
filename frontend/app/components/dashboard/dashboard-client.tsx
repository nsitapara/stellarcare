'use client'

import { searchPatients } from '@/app/actions/patient-search-action'
import type { Patient } from '@/types/api/models/Patient'
import type { PaginatedResponse } from '@/types/dashboard'
import { Button } from '@components/ui/button'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DashboardTable } from './dashboard-table'

interface DashboardClientProps {
  initialData: PaginatedResponse
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter()
  const [data, setData] = useState<PaginatedResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching data for page:', page, 'pageSize:', pageSize)

        let response: { results: Patient[]; count: number } | Patient[]
        if (searchQuery.length >= 3) {
          try {
            response = (await searchPatients(searchQuery)) as Patient[]
          } catch (error) {
            console.error('Search error:', error)
            throw new Error('Failed to search patients')
          }
        } else {
          const apiResponse = await fetch(
            `/api/patients?page=${page}&page_size=${pageSize}`,
            {
              headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
                'Content-Type': 'application/json'
              },
              cache: 'no-store'
            }
          ).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch data')
            return res.json()
          })
          response = apiResponse as { results: Patient[]; count: number }
        }

        const patients = Array.isArray(response) ? response : response.results
        const totalCount = Array.isArray(response)
          ? response.length
          : response.count

        const newData = {
          data: patients.map((patient: Patient) => ({
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
          total: totalCount,
          page: searchQuery.length >= 3 ? 1 : page,
          pageSize
        }

        setData(newData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load patient data. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    },
    [searchQuery]
  )

  // Debounced search handler
  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchData is needed for latest searchQuery state
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
      if (query.length >= 3 || query.length === 0) {
        fetchData(1, data.pageSize)
      }
    }, 300),
    [fetchData]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handlePageChange = (page: number) => {
    if (searchQuery.length >= 3) return // Disable pagination during search
    console.log('Page change requested:', page)
    fetchData(page, data.pageSize)
  }

  const handlePageSizeChange = (pageSize: number) => {
    if (searchQuery.length >= 3) return // Disable page size change during search
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
          onSearch={debouncedSearch}
        />
      )}
    </div>
  )
}
