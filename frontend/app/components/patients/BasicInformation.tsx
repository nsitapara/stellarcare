/**
 * BasicInformation Component
 *
 * Displays patient&apos;s basic information including:
 * - Name (First, Middle, Last)
 * - Date of Birth
 * - Status
 * - Addresses
 * - Custom Fields
 */

'use client'

import type { Address } from '@api/models/Address'
import type { Patient } from '@api/models/Patient'
import type { PatientCustomField } from '@api/models/PatientCustomField'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/ui/card'

interface BasicInformationProps {
  patient: Patient
}

export function BasicInformation({ patient }: BasicInformationProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
        <CardDescription>Patient&apos;s personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              First Name
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {patient.first}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Middle Name
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {patient.middle || '-'}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Last Name
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {patient.last}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Date of Birth
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(patient.date_of_birth).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Status
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {patient.status}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Addresses
          </h3>
          <div className="space-y-3">
            {patient.addresses.map((address: Address) => (
              <div
                key={`${address.street}-${address.city}-${address.state}-${address.zip_code}`}
                className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm"
              >
                <p className="text-gray-700 dark:text-gray-300">
                  {address.street}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {address.city}, {address.state} {address.zip_code}
                </p>
              </div>
            ))}
          </div>
        </div>

        {patient.patient_custom_fields &&
          patient.patient_custom_fields.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Additional Information
              </h3>
              <div className="space-y-3">
                {patient.patient_custom_fields.map(
                  (field: PatientCustomField) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm"
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {field.field_definition.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {field.field_definition.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {field.value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  )
}
