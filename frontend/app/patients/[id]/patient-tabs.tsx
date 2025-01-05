'use client'

import { AppointmentCard } from '@/app/components/AppointmentCard'
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
        {patient.appointments?.map((appointmentId) => (
          <AppointmentCard
            key={appointmentId}
            appointmentId={appointmentId.toString()}
          />
        ))}
      </TabsContent>
      <TabsContent value="studies">{/* Studies content */}</TabsContent>
      <TabsContent value="treatments">{/* Treatments content */}</TabsContent>
    </Tabs>
  )
}
