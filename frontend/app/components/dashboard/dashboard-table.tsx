'use client'

import type { DashboardData } from '@/types/dashboard'
import { cn } from '@components/lib/utils'
import { Button } from '@components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DashboardTableProps {
  data: DashboardData[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearch: (query: string) => void
  isLoading: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Inquiry':
      return 'status-inquiry'
    case 'Onboarding':
      return 'status-onboarding'
    case 'Active':
      return 'status-active'
    case 'Churned':
      return 'status-churned'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-200 ring-gray-500/30'
  }
}

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchValid, setIsSearchValid] = useState(true)
  const totalPages = Math.ceil(total / pageSize)

  const handleSearch = (value: string) => {
    setSearchQuery(value)

    if (value.length === 0) {
      setIsSearchValid(true)
      onSearch('')
      return
    }

    if (/^\d+$/.test(value)) {
      if (value.length === 6) {
        setIsSearchValid(true)
        onSearch(value)
      } else {
        setIsSearchValid(false)
      }
      return
    }

    if (value.length < 3) {
      setIsSearchValid(false)
      return
    }

    setIsSearchValid(true)
    onSearch(value)
  }

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`)
  }

  return (
    <div className="space-y-4">
      <div className="dashboard-search">
        <Search className="dashboard-search-icon" />
        <input
          type="text"
          placeholder="Search by name (min 3 chars) or patient ID (6 digits)..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className={cn(
            'dashboard-search-input',
            !isSearchValid &&
              searchQuery.length > 0 &&
              'border-red-500 focus:border-red-500 focus:ring-red-500/30'
          )}
        />
        {isLoading && (
          <div className="absolute right-8 top-[1.75rem]">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent" />
          </div>
        )}
        {!isSearchValid && searchQuery.length > 0 && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {/^\d+$/.test(searchQuery)
              ? 'Please enter all 6 digits of the patient ID'
              : 'Please enter at least 3 characters to search by name'}
          </p>
        )}
      </div>

      <div className="table-container bg-white dark:bg-zinc-900 border-border">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-zinc-800/50">
            <TableRow className="border-b-2 border-border hover:bg-transparent">
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[100px]">
                ID
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[200px]">
                Name
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[120px]">
                Date of Birth
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">
                Address
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[120px]">
                Status
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-border hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="font-mono text-gray-700 dark:text-gray-200 bg-gray-50/50 dark:bg-zinc-800/30">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200 font-medium">
                    {item.first} {item.middle} {item.last}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200">
                    {item.date_of_birth}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200">
                    {item.addresses && item.addresses.length > 0
                      ? item.addresses[0]
                      : 'No address'}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200">
                    <span
                      className={cn(
                        'table-status-badge',
                        getStatusColor(item.status)
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(
                          `/patients/${item.id}/edit?redirect=/dashboard`
                        )
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-border rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            Page {page} of {totalPages}
          </span>
          <select
            className="border rounded-md px-3 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-border"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="border-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="border-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
