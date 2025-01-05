'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import type { Patient } from '@/types/api/models/Patient'

interface BasicInformationProps {
  patient: Patient
  formattedDates: {
    dateOfBirth: string
    created: string
    updated: string
  }
}

export function BasicInformation({
  patient,
  formattedDates
}: BasicInformationProps) {
  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-y-6">
          <div>
            <dt className="text-sm text-gray-400">Full Name</dt>
            <dd className="text-white">
              {patient.first} {patient.middle} {patient.last}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Patient ID</dt>
            <dd className="text-white">{patient.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Date of Birth</dt>
            <dd className="text-white">{formattedDates.dateOfBirth}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Status</dt>
            <dd className="text-white">{patient.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Created</dt>
            <dd className="text-white">{formattedDates.created}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Last Updated</dt>
            <dd className="text-white">{formattedDates.updated}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-400">Address</dt>
            {patient.addresses?.map((address) => (
              <dd
                key={`${address.street}-${address.city}-${address.state}`}
                className="text-white mt-1"
              >
                {address.street}, {address.city}, {address.state}{' '}
                {address.zip_code}
              </dd>
            ))}
          </div>
          {patient.custom_fields && patient.custom_fields.length > 0 && (
            <div className="col-span-2">
              <dt className="text-sm text-gray-400 mb-2">
                Clinical Information
              </dt>
              <div className="grid grid-cols-2 gap-4">
                {patient.custom_fields.map((field) => (
                  <div key={`${field.name}-${field.value}`}>
                    <dt className="text-sm text-gray-400">{field.name}</dt>
                    <dd className="text-white">{field.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
