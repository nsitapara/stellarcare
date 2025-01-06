/**
 * Patient Table Component
 *
 * A table component for displaying patient data with status badges and address formatting.
 * Features:
 * - Clickable rows for viewing patient details
 * - Status badges with color coding
 * - Address badges with color cycling
 * - Edit button for quick access to patient editing
 */

'use client'

import type { PatientTableProps } from '@api/dashboard'
import { cn } from '@components/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'

/**
 * Gets the color class for address badges based on index
 * @param index - Index of the address in the list
 * @returns CSS class string for the address badge
 */
const getAddressColor = (index: number) => {
  const colors = [
    'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200 ring-1 ring-purple-500/30',
    'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200 ring-1 ring-green-500/30',
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 ring-1 ring-amber-500/30',
    'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200 ring-1 ring-rose-500/30'
  ]
  return colors[index % colors.length]
}

/**
 * Gets the status color class based on patient status
 * @param status - Patient's status
 * @returns CSS class string for the status indicator
 */
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-500'
    case 'inquiry':
      return 'bg-blue-500'
    case 'onboarding':
      return 'bg-amber-500'
    case 'churned':
      return 'bg-rose-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Gets the color class for custom field badges based on index
 * @param index - Index of the custom field in the list
 * @returns CSS class string for the custom field badge
 */
const getCustomFieldColor = (index: number) => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200 ring-1 ring-blue-500/30',
    'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200 ring-1 ring-teal-500/30',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200 ring-1 ring-indigo-500/30',
    'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200 ring-1 ring-pink-500/30'
  ]
  return colors[index % colors.length]
}

/**
 * Status legend component to display available statuses
 */
function StatusLegend() {
  const statuses = [
    { status: 'Active', color: 'bg-emerald-500' },
    { status: 'Inquiry', color: 'bg-blue-500' },
    { status: 'Onboarding', color: 'bg-amber-500' },
    { status: 'Churned', color: 'bg-rose-500' }
  ]

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border-b border-border text-xs">
      <span className="font-medium text-gray-700 dark:text-gray-200">
        Status:
      </span>
      <div className="flex gap-4">
        {statuses.map(({ status, color }) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-3 rounded-sm', color)} />
            <span className="text-gray-600 dark:text-gray-300">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * PatientTable component displays patient data in a tabular format with interactive elements
 */
export function PatientTable({ data, onEdit, onView }: PatientTableProps) {
  return (
    <div className="table-container bg-white dark:bg-zinc-900 border-border rounded-md overflow-hidden">
      <StatusLegend />
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-zinc-800/50">
          <TableRow className="border-b-2 border-border hover:bg-transparent">
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[80px]">
              ID
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[220px]">
              Name
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[140px]">
              Date of Birth
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[240px]">
              Address
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[200px]">
              Additional Info
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[80px]">
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
                className="table-row cursor-pointer"
                onClick={() => onView(item.id)}
              >
                <TableCell className="font-mono text-gray-700 dark:text-gray-200 bg-gray-50/50 dark:bg-zinc-800/30 w-[80px] relative pl-3">
                  <div
                    className={cn(
                      'absolute left-0 top-0 bottom-0 w-1',
                      getStatusColor(item.status)
                    )}
                  />
                  {item.id}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-200 font-medium w-[220px]">
                  {item.first} {item.middle} {item.last}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-200 w-[140px]">
                  {item.date_of_birth}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-200 w-[240px]">
                  {item.addresses && item.addresses.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {item.addresses.map((address, index) => (
                        <span
                          key={`${item.id}-${address}`}
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium break-words w-full',
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
                <TableCell className="text-gray-700 dark:text-gray-200 w-[200px]">
                  {item.customFields && item.customFields.length > 0 ? (
                    <div className="flex flex-col gap-1.5 py-1">
                      {item.customFields.map((field, index) => (
                        <span
                          key={`${item.id}-${field.name}`}
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium break-words w-full',
                            getCustomFieldColor(index)
                          )}
                        >
                          {field.name}: {field.value}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No custom fields
                    </span>
                  )}
                </TableCell>
                <TableCell className="w-[80px]">
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
