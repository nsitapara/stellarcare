'use client'

import { searchPatients } from '@/app/actions/patient-search-action'
import type { Patient } from '@/types/api/models/Patient'
import type { PaginatedResponse } from '@/types/dashboard'
import { Button } from '@components/ui/button'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DashboardTable } from './dashboard-table'

interface DashboardClientProps {
  initialData: PaginatedResponse
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // biome-ignore lint/correctness/useExhaustiveDependencies: searchQuery is intentionally omitted to prevent unnecessary rerenders
  const fetchData = useCallback(
    async (page: number, pageSize: number, query: string = searchQuery) => {
      try {
        setLoading(true)
        setError(null)

        let response: { results: Patient[]; count: number } | Patient[]
        if (query.length >= 3) {
          response = (await searchPatients(query)) as Patient[]
        } else if (query.length === 0) {
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
        } else {
          // For queries between 1-2 characters, don't fetch
          setLoading(false)
          return
        }

        const patients = Array.isArray(response) ? response : response.results
        const totalCount = Array.isArray(response)
          ? response.length
          : response.count

        setData({
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
          page: query.length >= 3 ? 1 : page,
          pageSize
        })
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
    []
  )

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        fetchData(1, data.pageSize, query)
      }, 300),
    [fetchData, data.pageSize]
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      debouncedFetch(query)
    },
    [debouncedFetch]
  )

  useEffect(() => {
    return () => {
      debouncedFetch.cancel()
    }
  }, [debouncedFetch])

  const handlePageChange = (page: number) => {
    if (searchQuery.length >= 3) return // Disable pagination during search
    fetchData(page, data.pageSize, searchQuery)
  }

  const handlePageSizeChange = (pageSize: number) => {
    if (searchQuery.length >= 3) return // Disable page size change during search
    fetchData(1, pageSize, searchQuery)
  }

  return (
    <div className="container-wrapper">
      <div className="space-y-2">
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
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
        ) : (
          <div className="form-card">
            <DashboardTable
              data={data.data}
              total={data.total}
              page={data.page}
              pageSize={data.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
