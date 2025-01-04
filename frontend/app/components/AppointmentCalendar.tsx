'use client'

import type { Appointment } from '@/types/patient'
import { Button } from '@components/ui/button'
import { Calendar } from '@components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@components/ui/dialog'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'
import { Textarea } from '@components/ui/textarea'
import { useState } from 'react'

type AppointmentCalendarProps = {
  appointments?: Appointment[]
  onAddAppointment: (appointment: Appointment) => void
}

export function AppointmentCalendar({
  appointments,
  onAddAppointment
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddingAppointment, setIsAddingAppointment] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const appointment: Appointment = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as 'In-Person' | 'Telehealth',
      status: 'Scheduled',
      notes: formData.get('notes') as string,
      zoomLink:
        formData.get('type') === 'Telehealth'
          ? 'https://zoom.us/j/example'
          : undefined
    }
    onAddAppointment(appointment)
    setIsAddingAppointment(false)

    // Mock appointment reminder
    if (appointment.type === 'Telehealth') {
      console.log(
        `SMS: Your telehealth appointment is scheduled for ${appointment.date} at ${appointment.time}. Join here: ${appointment.zoomLink}`
      )
    } else {
      console.log(
        `SMS: Your in-person appointment is scheduled for ${appointment.date} at ${appointment.time}.`
      )
    }
  }

  const dateHasAppointment = (date: Date) => {
    return (
      appointments?.some(
        (apt) => apt.date === date.toISOString().split('T')[0]
      ) || false
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Appointments</h3>
        <Dialog
          open={isAddingAppointment}
          onOpenChange={setIsAddingAppointment}
        >
          <DialogTrigger asChild>
            <Button>Schedule Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Enter the appointment details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={selectedDate?.toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" id="time" name="time" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Telehealth">Telehealth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" />
                </div>
              </div>
              <Button type="submit">Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-4">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => dateHasAppointment(date)
              }}
              modifiersStyles={{
                booked: { backgroundColor: 'var(--primary)' }
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-medium">Upcoming Appointments</h4>
          {(appointments || [])
            .filter((apt) => new Date(apt.date) >= new Date())
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle>
                    {new Date(appointment.date).toLocaleDateString()} at{' '}
                    {appointment.time}
                  </CardTitle>
                  <CardDescription>{appointment.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">Status: {appointment.status}</div>
                    {appointment.zoomLink && (
                      <div>
                        <a
                          href={appointment.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Join Telehealth Session
                        </a>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="text-sm text-gray-500">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
