'use client'

import type { Patient, PatientStatus } from '@/types/patient'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Input } from '@components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'
import { useState } from 'react'

type PatientTableProps = {
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (patientId: string) => void
  onSelect: (patient: Patient) => void
}

export function PatientTable({
  patients,
  onEdit,
  onDelete,
  onSelect
}: PatientTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'All'>('All')

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || patient.status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border-gray-200 focus:border-accent focus:ring-accent"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200">
              Filter by Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('All')}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('Inquiry')}>
              Inquiry
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Onboarding')}>
              Onboarding
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Churned')}>
              Churned
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Date of Birth</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Primary Address</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients?.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {`${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`}
                </TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${patient.status === 'Inquiry' ? 'bg-blue-100 text-blue-800' : ''}
                    ${patient.status === 'Onboarding' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${patient.status === 'Churned' ? 'bg-red-100 text-red-800' : ''}
                  `}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>
                  {patient.addresses[0]
                    ? `${patient.addresses[0].street}, ${patient.addresses[0].city}, ${patient.addresses[0].state} ${patient.addresses[0].zipCode}`
                    : 'No address provided'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => onSelect(patient)}
                      className="text-accent hover:text-accent-foreground"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onEdit(patient)}
                      className="text-accent hover:text-accent-foreground"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onDelete(patient.id)}
                      className="text-destructive hover:text-destructive-foreground"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
