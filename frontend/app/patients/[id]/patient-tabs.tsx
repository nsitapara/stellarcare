'use client'

import { AppointmentCard } from '@/app/components/AppointmentCard'
import { BasicInformation } from '@/app/components/BasicInformation'
import { InsuranceCard } from '@/app/components/InsuranceCard'
import { SleepStudyCard } from '@/app/components/SleepStudyCard'
import { TreatmentCard } from '@/app/components/TreatmentCard'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs'
import type { Patient } from '@/types/api/models/Patient'
import { format, parseISO } from 'date-fns'

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {patient.first} {patient.middle} {patient.last}
          </h1>
          <p className="text-sm text-gray-400">Patient ID: {patient.id}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
            {patient.status}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="studies">Sleep Studies</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <BasicInformation patient={patient} formattedDates={formattedDates} />
        </TabsContent>
        <TabsContent value="appointments">
          <div className="grid gap-4">
            {patient.appointments?.map((appointmentId) => (
              <AppointmentCard
                key={appointmentId}
                appointmentId={appointmentId.toString()}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="studies">
          <div className="grid gap-4">
            {patient.studies?.map((studyId) => (
              <SleepStudyCard key={studyId} studyId={studyId.toString()} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="treatments">
          <div className="grid gap-4">
            {patient.treatments?.map((treatmentId) => (
              <TreatmentCard
                key={treatmentId}
                treatmentId={treatmentId.toString()}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="insurance">
          <div className="grid gap-4">
            {patient.insurance?.map((insuranceId) => (
              <InsuranceCard
                key={insuranceId}
                insuranceId={insuranceId.toString()}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
