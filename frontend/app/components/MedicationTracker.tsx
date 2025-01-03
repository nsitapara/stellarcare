'use client'

import type { CPAPUsage, Medication } from '@/types/patient'
import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { useState } from 'react'

type MedicationTrackerProps = {
  medications: Medication[]
  cpapUsage: CPAPUsage[]
  onAddMedication: (medication: Medication) => void
  onAddCPAPUsage: (usage: CPAPUsage) => void
}

export function MedicationTracker({
  medications,
  cpapUsage,
  onAddMedication,
  onAddCPAPUsage
}: MedicationTrackerProps) {
  const [isAddingMed, setIsAddingMed] = useState(false)
  const [isAddingCPAP, setIsAddingCPAP] = useState(false)

  const handleMedicationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const medication: Medication = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || undefined,
      notes: formData.get('notes') as string
    }
    onAddMedication(medication)
    setIsAddingMed(false)
  }

  const handleCPAPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const usage: CPAPUsage = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      hoursUsed: Number(formData.get('hoursUsed')),
      eventsPerHour: Number(formData.get('eventsPerHour')),
      maskLeak: Number(formData.get('maskLeak')),
      notes: formData.get('notes') as string
    }
    onAddCPAPUsage(usage)
    setIsAddingCPAP(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Medications</h3>
          <Button onClick={() => setIsAddingMed(!isAddingMed)}>
            {isAddingMed ? 'Cancel' : 'Add Medication'}
          </Button>
        </div>

        {isAddingMed && (
          <Card>
            <CardHeader>
              <CardTitle>New Medication</CardTitle>
              <CardDescription>
                Enter the medication details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMedicationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medication Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input id="dosage" name="dosage" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input id="frequency" name="frequency" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" id="endDate" name="endDate" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" />
                </div>
                <Button type="submit">Save Medication</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 mt-4">
          {medications?.map((medication) => (
            <Card key={medication.id}>
              <CardHeader>
                <CardTitle>{medication.name}</CardTitle>
                <CardDescription>
                  {medication.dosage} - {medication.frequency}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Start Date
                    </dt>
                    <dd>
                      {new Date(medication.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {medication.endDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        End Date
                      </dt>
                      <dd>
                        {new Date(medication.endDate).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {medication.notes && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Notes
                      </dt>
                      <dd className="text-sm mt-1">{medication.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">CPAP Usage</h3>
          <Button onClick={() => setIsAddingCPAP(!isAddingCPAP)}>
            {isAddingCPAP ? 'Cancel' : 'Add CPAP Usage'}
          </Button>
        </div>

        {isAddingCPAP && (
          <Card>
            <CardHeader>
              <CardTitle>New CPAP Usage</CardTitle>
              <CardDescription>
                Enter the CPAP usage details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCPAPSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" name="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursUsed">Hours Used</Label>
                    <Input
                      type="number"
                      step="0.1"
                      id="hoursUsed"
                      name="hoursUsed"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventsPerHour">Events Per Hour</Label>
                    <Input
                      type="number"
                      step="0.1"
                      id="eventsPerHour"
                      name="eventsPerHour"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maskLeak">Mask Leak (L/min)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      id="maskLeak"
                      name="maskLeak"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" />
                </div>
                <Button type="submit">Save Usage</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 mt-4">
          {cpapUsage?.map((usage) => (
            <Card key={usage.id}>
              <CardHeader>
                <CardTitle>
                  Usage for {new Date(usage.date).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Hours Used
                    </dt>
                    <dd>{usage.hoursUsed} hours</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Events Per Hour
                    </dt>
                    <dd>{usage.eventsPerHour}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Mask Leak
                    </dt>
                    <dd>{usage.maskLeak} L/min</dd>
                  </div>
                  {usage.notes && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Notes
                      </dt>
                      <dd className="text-sm mt-1">{usage.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
