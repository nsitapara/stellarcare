/**
 * Patient Table Component
 *
 * A table component for displaying patient data with status badges and address formatting.
 */

'use client'

import type { DashboardData } from '@api/dashboard'
import { cn } from '@components/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'

interface PatientTableProps {
  data: DashboardData[]
  onEdit: (id: string) => void
  onView: (id: string) => void
}

/**
 * Maps patient status to corresponding CSS classes for visual styling
 */
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

/**
 * Gets the color class for address badges based on index
 */
const getAddressColor = (index: number) => {
  const colors = [
    'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200 ring-purple-500/30',
    'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200 ring-green-500/30',
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 ring-amber-500/30',
    'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200 ring-rose-500/30'
  ]
  return colors[index % colors.length]
}

export function PatientTable({ data, onEdit, onView }: PatientTableProps) {
  return (
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
                onClick={() => onView(item.id)}
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
                  {item.addresses && item.addresses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.addresses.map((address, index) => (
                        <span
                          key={`${item.id}-${address}`}
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            getAddressColor(index)
                          )}
                        >
                          {address}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No address
                    </span>
                  )}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item.id)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
