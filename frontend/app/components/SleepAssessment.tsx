'use client'

import type { SleepStudy } from '@/types/patient'
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

type SleepAssessmentProps = {
  studies: SleepStudy[]
  onAddStudy: (study: SleepStudy) => void
}

export function SleepAssessment({ studies, onAddStudy }: SleepAssessmentProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const study: SleepStudy = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      ahi: Number(formData.get('ahi')),
      sleepEfficiency: Number(formData.get('sleepEfficiency')),
      remLatency: Number(formData.get('remLatency')),
      notes: formData.get('notes') as string
    }
    onAddStudy(study)
    setIsAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sleep Assessments</h3>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Study'}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>New Sleep Study</CardTitle>
            <CardDescription>
              Enter the sleep study details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Study Date</Label>
                  <Input type="date" id="date" name="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ahi">AHI</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="ahi"
                    name="ahi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleepEfficiency">Sleep Efficiency (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="sleepEfficiency"
                    name="sleepEfficiency"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remLatency">REM Latency (min)</Label>
                  <Input
                    type="number"
                    id="remLatency"
                    name="remLatency"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <Button type="submit">Save Study</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {studies?.map((study) => (
          <Card key={study.id}>
            <CardHeader>
              <CardTitle>
                Study Date: {new Date(study.date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">AHI</dt>
                  <dd className="text-lg">{study.ahi}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Sleep Efficiency
                  </dt>
                  <dd className="text-lg">{study.sleepEfficiency}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    REM Latency
                  </dt>
                  <dd className="text-lg">{study.remLatency} min</dd>
                </div>
                {study.notes && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="text-sm mt-1">{study.notes}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
