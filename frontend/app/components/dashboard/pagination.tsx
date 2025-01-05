/**
 * Pagination Component
 *
 * A reusable pagination component with page size selection.
 * Features:
 * - Page size selection (10, 25, 50 items per page)
 * - Previous/Next navigation buttons
 * - Current page indicator
 * - Automatic button disabling at boundaries
 */

'use client'

import type { PaginationProps } from '@api/dashboard'
import { Button } from '@components/ui/button'

/**
 * Pagination component provides navigation controls for paginated data
 */
export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white dark:bg-zinc-900 border-border rounded-lg p-4 flex items-center justify-between">
      <div>
        <select
          className="border rounded-md px-3 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-border"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
