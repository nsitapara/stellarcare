'use client'

import { AppointmentCard } from '@/app/components/AppointmentCard'
import { BasicInformation } from '@/app/components/BasicInformation'
import { InsuranceCard } from '@/app/components/InsuranceCard'
import { SleepStudyCard } from '@/app/components/SleepStudyCard'
import { TreatmentCard } from '@/app/components/TreatmentCard'
import { Button } from '@/app/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs'
import type { Patient } from '@/types/api/models/Patient'
import { format, parseISO } from 'date-fns'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

interface PatientTabsProps {
  patient: Patient
}

export function PatientTabs({ patient }: PatientTabsProps) {
  // Format dates in UTC to ensure consistency between server and client
  const formattedDates = {
    dateOfBirth: format(parseISO(patient.date_of_birth), 'MMMM d, yyyy'),
    created: format(parseISO(patient.created_at), 'MMMM d, yyyy'),
    updated: format(parseISO(patient.modified_at), 'MMMM d, yyyy')
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active'
      case 'inquiry':
        return 'status-inquiry'
      case 'onboarding':
        return 'status-onboarding'
      case 'churned':
        return 'status-churned'
      default:
        return 'status-inquiry'
    }
  }

  return (
    <div className="form-card space-y-6">
      <div className="form-card-header">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="dashboard-title">
              {patient.first} {patient.middle} {patient.last}
            </h1>
            <p className="dashboard-subtitle">Patient ID: {patient.id}</p>
          </div>
          <Link href={`/patients/${patient.id}/edit`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit patient</span>
            </Button>
          </Link>
        </div>
        <div>
          <span
            className={`table-status-badge ${getStatusClass(patient.status)}`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border-2 border-border/80">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="studies">Sleep Studies</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <BasicInformation
              patient={patient}
              formattedDates={formattedDates}
            />
          </div>
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-4">
            {patient.appointments?.length ? (
              patient.appointments.map((appointmentId) => (
                <AppointmentCard
                  key={appointmentId}
                  appointmentId={appointmentId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="studies" className="mt-6">
          <div className="space-y-4">
            {patient.studies?.length ? (
              patient.studies.map((studyId) => (
                <SleepStudyCard key={studyId} studyId={studyId.toString()} />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No sleep studies found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="treatments" className="mt-6">
          <div className="space-y-4">
            {patient.treatments?.length ? (
              patient.treatments.map((treatmentId) => (
                <TreatmentCard
                  key={treatmentId}
                  treatmentId={treatmentId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No treatments found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="insurance" className="mt-6">
          <div className="space-y-4">
            {patient.insurance?.length ? (
              patient.insurance.map((insuranceId) => (
                <InsuranceCard
                  key={insuranceId}
                  insuranceId={insuranceId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">
                  No insurance information found
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
