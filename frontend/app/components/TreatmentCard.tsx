'use client'

import { getTreatment } from '@/app/actions/get-treatment-action'
import { Badge } from '@/app/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface Treatment {
  id: number
  name: string
  type: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string
  notes?: string
}

export function TreatmentCard({ treatmentId }: { treatmentId: string }) {
  const [treatment, setTreatment] = useState<Treatment | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTreatment() {
      try {
        const data = await getTreatment(treatmentId)
        setTreatment(data as Treatment)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load treatment'
        )
      }
    }

    fetchTreatment()
  }, [treatmentId])

  if (error) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!treatment) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-muted-foreground">Loading treatment...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="form-card bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-foreground">{treatment.name}</CardTitle>
          <Badge>{treatment.dosage}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Type</dt>
            <dd className="text-foreground">{treatment.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Frequency</dt>
            <dd className="text-foreground">{treatment.frequency}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Start Date</dt>
            <dd className="text-foreground">
              {format(new Date(treatment.start_date), 'MMMM d, yyyy')}
            </dd>
          </div>
          {treatment.end_date && (
            <div>
              <dt className="text-sm text-muted-foreground">End Date</dt>
              <dd className="text-foreground">
                {format(new Date(treatment.end_date), 'MMMM d, yyyy')}
              </dd>
            </div>
          )}
          {treatment.notes && (
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="text-foreground">{treatment.notes}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
