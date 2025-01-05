/**
 * Dashboard Client Component
 *
 * A client-side component that provides a dynamic interface for managing patient data.
 * Features:
 * - Real-time search with debouncing
 * - Pagination with server-side data fetching and loading states
 * - Loading states and error handling
 * - Navigation to patient details and edit pages
 */

'use client'

import { usePatientData } from '@actions/patient/use-patient-data'
import type { DashboardClientProps } from '@api/dashboard'
import { DashboardTable } from '@components/dashboard/dashboard-table'
import { Button } from '@components/ui/button'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'

/**
 * DashboardClient component manages the state and interactions for the patient dashboard
 */
export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter()
  const { data, loading, error, searchQuery, setSearchQuery, fetchData } =
    usePatientData({ initialData })

  // Debounce search queries to avoid excessive API calls
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
    [debouncedFetch, setSearchQuery]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel()
    }
  }, [debouncedFetch])

  // Handle pagination changes
  const handlePageChange = useCallback(
    async (page: number) => {
      if (searchQuery.length >= 3) return // Disable pagination during search
      await fetchData(page, data.pageSize, searchQuery)
    },
    [fetchData, data.pageSize, searchQuery]
  )

  const handlePageSizeChange = useCallback(
    async (pageSize: number) => {
      if (searchQuery.length >= 3) return // Disable page size change during search
      await fetchData(1, pageSize, searchQuery)
    },
    [fetchData, searchQuery]
  )

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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
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
