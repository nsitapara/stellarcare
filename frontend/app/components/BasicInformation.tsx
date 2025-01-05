'use client'

import type { Patient } from '@api/models/Patient'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'

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
    <Card className="form-card bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-y-6">
          <div>
            <dt className="text-sm text-muted-foreground">Full Name</dt>
            <dd className="text-foreground">
              {patient.first} {patient.middle} {patient.last}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Patient ID</dt>
            <dd className="text-foreground">{patient.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Date of Birth</dt>
            <dd className="text-foreground">{formattedDates.dateOfBirth}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="text-foreground">{patient.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Created</dt>
            <dd className="text-foreground">{formattedDates.created}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Last Updated</dt>
            <dd className="text-foreground">{formattedDates.updated}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-muted-foreground">Address</dt>
            {patient.addresses?.map((address) => (
              <dd
                key={`${address.street}-${address.city}-${address.state}`}
                className="text-foreground mt-1"
              >
                {address.street}, {address.city}, {address.state}{' '}
                {address.zip_code}
              </dd>
            ))}
          </div>
          {patient.patient_custom_fields &&
            patient.patient_custom_fields.length > 0 && (
              <div className="col-span-2">
                <dt className="text-sm text-muted-foreground mb-2">
                  Additional Information
                </dt>
                <div className="grid grid-cols-2 gap-4">
                  {patient.patient_custom_fields.map((field) => (
                    <div key={`${field.field_definition.name}-${field.value}`}>
                      <dt className="text-sm text-muted-foreground">
                        {field.field_definition.name}
                      </dt>
                      <dd className="text-foreground">{field.value}</dd>
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
