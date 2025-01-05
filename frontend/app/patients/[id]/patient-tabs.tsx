'use client'

import { AppointmentCard } from '@/app/components/AppointmentCard'
import { SleepStudyCard } from '@/app/components/SleepStudyCard'
import { TreatmentCard } from '@/app/components/TreatmentCard'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs'
import type { Patient } from '@/types/api/models/Patient'

interface PatientTabsProps {
  patient: Patient
}

export function PatientTabs({ patient }: PatientTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="studies">Sleep Studies</TabsTrigger>
        <TabsTrigger value="treatments">Treatments</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{/* Overview content */}</TabsContent>
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
    </Tabs>
  )
}
