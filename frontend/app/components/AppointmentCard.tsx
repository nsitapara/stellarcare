'use client'

import { getAppointment } from '@/app/actions/get-appointment-action'
import { Badge } from '@/app/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
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

export function AppointmentCard({ appointmentId }: { appointmentId: string }) {
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
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!appointment) {
    return (
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-gray-400">Loading appointment...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-gray-400">Date & Time</dt>
            <dd className="text-white">
              {format(
                new Date(`${appointment.date}T${appointment.time}`),
                'MMMM d, yyyy h:mm a'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Type</dt>
            <dd className="text-white">{appointment.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Status</dt>
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
              <dt className="text-sm text-gray-400">Notes</dt>
              <dd className="text-white">{appointment.notes}</dd>
            </div>
          )}
          {appointment.zoom_link && (
            <div>
              <dt className="text-sm text-gray-400">Zoom Link</dt>
              <dd>
                <a
                  href={appointment.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
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
