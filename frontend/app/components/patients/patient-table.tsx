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
    'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200 ring-purple-500/30',
    'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200 ring-green-500/30',
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 ring-amber-500/30',
    'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200 ring-rose-500/30'
  ]
  return colors[index % colors.length]
}

/**
 * Gets the color class for custom field badges based on index
 * @param index - Index of the custom field in the list
 * @returns CSS class string for the custom field badge
 */
const getCustomFieldColor = (index: number) => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200 ring-blue-500/30',
    'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200 ring-teal-500/30',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200 ring-indigo-500/30',
    'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200 ring-pink-500/30'
  ]
  return colors[index % colors.length]
}

/**
 * PatientTable component displays patient data in a tabular format with interactive elements
 */
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
            <TableHead className="text-gray-700 dark:text-gray-200 font-semibold w-[200px]">
              Custom Fields
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
                  {item.customFields && item.customFields.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.customFields.map((field, index) => (
                        <span
                          key={`${item.id}-${field.name}`}
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
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
