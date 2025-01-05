'use client'

import { getAppointment } from '@actions/patient/get-appointment-action'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface Appointment {
  id: number
  date: string
  time: string
  type: string
  status: string
  notes?: string
  zoom_link?: string
}

export function VisitCard({ appointmentId }: { appointmentId: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const data = await getAppointment(appointmentId)
        setAppointment(data as Appointment)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load appointment'
        )
      }
    }

    fetchAppointment()
  }, [appointmentId])

  if (error) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!appointment) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-muted-foreground">Loading appointment...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="form-card bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Appointment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Date & Time</dt>
            <dd className="text-foreground">
              {format(
                new Date(`${appointment.date}T${appointment.time}`),
                'MMMM d, yyyy h:mm a'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Type</dt>
            <dd className="text-foreground">{appointment.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd>
              <Badge
                variant={
                  appointment.status === 'Completed'
                    ? 'default'
                    : appointment.status === 'Scheduled'
                      ? 'outline'
                      : appointment.status === 'Cancelled'
                        ? 'secondary'
                        : 'destructive'
                }
              >
                {appointment.status}
              </Badge>
            </dd>
          </div>
          {appointment.notes && (
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="text-foreground">{appointment.notes}</dd>
            </div>
          )}
          {appointment.zoom_link && (
            <div>
              <dt className="text-sm text-muted-foreground">Zoom Link</dt>
              <dd>
                <a
                  href={appointment.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  Join Meeting
                </a>
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
