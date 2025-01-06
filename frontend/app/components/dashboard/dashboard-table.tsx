/**
 * Dashboard Table Component
 *
 * A responsive table component for displaying and managing patient data.
 * Features:
 * - Search functionality with validation
 * - Pagination controls with loading states
 * - Patient data display with status badges
 * - Edit and view actions
 */

'use client'

import type { DashboardTableProps } from '@api/dashboard'
import { Pagination } from '@components/dashboard/pagination'
import { SearchBar } from '@components/dashboard/search-bar'
import { PatientTable } from '@components/patients/patient-table'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * DashboardTable component combines search, table, and pagination functionality
 */
export function DashboardTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  isLoading
}: DashboardTableProps) {
  const router = useRouter()
  const [loadingPage, setLoadingPage] = useState<number | null>(null)
  const [loadingPageSize, setLoadingPageSize] = useState(false)

  const handlePageChange = async (newPage: number) => {
    setLoadingPage(newPage)
    await onPageChange(newPage)
    setLoadingPage(null)
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    setLoadingPageSize(true)
    await onPageSizeChange(newPageSize)
    setLoadingPageSize(false)
  }

  return (
    <div className="space-y-4">
      <SearchBar onSearch={onSearch} isLoading={isLoading} />

      <PatientTable
        data={data}
        onEdit={(id: string) =>
          router.push(`/patients/${id}/edit?redirect=/dashboard`)
        }
        onView={(id: string) => router.push(`/patients/${id}`)}
      />

      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading || loadingPageSize}
        loadingPage={loadingPage}
      />
    </div>
  )
}
