'use client'

import type { DashboardData } from '@/types/dashboard'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'
import { cn } from '@lib/utils'
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
      return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200 ring-blue-500/30'
    case 'Onboarding':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200 ring-yellow-500/30'
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200 ring-green-500/30'
    case 'Churned':
      return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200 ring-red-500/30'
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
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-foreground dark:text-gray-300" />
          <Input
            placeholder="Search patients (minimum 3 characters)..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={cn(
              'pl-8 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 placeholder:text-gray-500 dark:placeholder:text-gray-400',
              !isSearchValid && searchQuery.length > 0 && 'border-red-500',
              isLoading && 'pr-8'
            )}
          />
          {isLoading && (
            <div className="absolute right-2 top-2.5">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent" />
            </div>
          )}
          {!isSearchValid && searchQuery.length > 0 && (
            <p className="mt-1 text-sm text-red-500">
              Please enter at least 3 characters to search
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border-2 border-border bg-card text-card-foreground overflow-hidden dark:bg-zinc-900/80 dark:border-zinc-700">
        <Table className="border-collapse [&_tr:last-child]:border-0">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-zinc-800 border-b border-border dark:border-zinc-700">
              <TableHead className="font-semibold text-foreground border-b border-border dark:border-zinc-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground border-b border-border dark:border-zinc-700">
                Date of Birth
              </TableHead>
              <TableHead className="font-semibold text-foreground border-b border-border dark:border-zinc-700">
                Address
              </TableHead>
              <TableHead className="font-semibold text-foreground border-b border-border dark:border-zinc-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground border-b border-border dark:border-zinc-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-foreground dark:text-gray-300"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 border-b border-border dark:border-zinc-700"
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="font-medium text-foreground dark:text-gray-200 border-r border-border dark:border-zinc-700">
                    {item.first} {item.middle} {item.last}
                  </TableCell>
                  <TableCell className="text-foreground dark:text-gray-200 border-r border-border dark:border-zinc-700">
                    {item.date_of_birth}
                  </TableCell>
                  <TableCell className="text-foreground dark:text-gray-200 border-r border-border dark:border-zinc-700">
                    {item.addresses && item.addresses.length > 0
                      ? item.addresses[0]
                      : 'No address'}
                  </TableCell>
                  <TableCell className="border-r border-border dark:border-zinc-700">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        getStatusColor(item.status)
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="dark:bg-zinc-900/80">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="hover:opacity-90 dark:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/patients/${item.id}/edit`)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-6 text-sm">
          <span className="text-foreground dark:text-gray-200">
            Page {page} of {totalPages}
          </span>
          <select
            className="border rounded px-2 py-1 text-sm bg-background dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <div className="space-x-2">
            <Button
              variant="default"
              size="sm"
              className="hover:opacity-90 dark:text-white"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              className="hover:opacity-90 dark:text-white"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
