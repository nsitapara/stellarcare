'use client'

import { InsuranceInfo } from '@components/InsuranceInfo'
import { MedicationTracker } from '@components/MedicationTracker'
import { SleepAssessment } from '@components/SleepAssessment'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

interface PatientTabsProps {
  patientId: string
}

export function PatientTabs({ patientId }: PatientTabsProps) {
  return (
    <Tabs defaultValue="insurance" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="sleep">Sleep Assessment</TabsTrigger>
      </TabsList>

      <TabsContent value="insurance">
        <InsuranceInfo patientId={patientId} />
      </TabsContent>

      <TabsContent value="medications">
        <MedicationTracker patientId={patientId} />
      </TabsContent>

      <TabsContent value="sleep">
        <SleepAssessment patientId={patientId} />
      </TabsContent>
    </Tabs>
  )
}
