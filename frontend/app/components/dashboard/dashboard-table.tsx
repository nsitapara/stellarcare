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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pagination } from './pagination'
import { PatientTable } from './patient-table'
import { SearchBar } from './search-bar'

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

  const handlePageChange = async (newPage: number) => {
    setLoadingPage(newPage)
    await onPageChange(newPage)
    setLoadingPage(null)
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
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
        loadingPage={loadingPage}
      />
    </div>
  )
}
