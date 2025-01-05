'use client'

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
import { useEffect, useState } from 'react'

type AppointmentType = 'In-Person' | 'Telehealth'

interface AppointmentWithPatient {
  id: string
  date: string
  time: string
  type: AppointmentType
  status: string
  patientName: string
  notes?: string
  duration: string
  zoomLink?: string
}

// Mock data for upcoming appointments
const mockUpcomingAppointments: AppointmentWithPatient[] = [
  {
    id: '1',
    date: '2024-01-04',
    time: '09:00',
    type: 'In-Person',
    status: 'Scheduled',
    patientName: 'John Doe',
    notes: 'Regular check-up appointment',
    duration: '30 minutes'
  },
  {
    id: '2',
    date: '2024-01-05',
    time: '14:30',
    type: 'Telehealth',
    status: 'Confirmed',
    patientName: 'Jane Smith',
    notes: 'Follow-up consultation',
    duration: '45 minutes',
    zoomLink: 'https://zoom.us/j/example'
  },
  {
    id: '3',
    date: '2024-01-08',
    time: '11:00',
    type: 'In-Person',
    status: 'Scheduled',
    patientName: 'Mike Johnson',
    notes: 'Annual physical examination',
    duration: '60 minutes'
  },
  {
    id: '4',
    date: '2024-01-10',
    time: '13:15',
    type: 'Telehealth',
    status: 'Confirmed',
    patientName: 'Sarah Williams',
    notes: 'Medication review and consultation',
    duration: '30 minutes',
    zoomLink: 'https://zoom.us/j/example'
  },
  {
    id: '5',
    date: '2024-01-12',
    time: '10:30',
    type: 'In-Person',
    status: 'Scheduled',
    patientName: 'Robert Brown',
    notes: 'Initial consultation',
    duration: '45 minutes'
  }
]

export function AppointmentCalendar() {
  const [mounted, setMounted] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isAddingAppointment, setIsAddingAppointment] = useState(false)

  // Initialize state after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setAppointments(mockUpcomingAppointments)
    setSelectedDate(new Date())
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const appointment: AppointmentWithPatient = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as AppointmentType,
      status: 'Scheduled',
      patientName: 'New Patient', // This would come from patient selection
      notes: formData.get('notes') as string,
      duration: '30 minutes',
      zoomLink:
        formData.get('type') === 'Telehealth'
          ? 'https://zoom.us/j/example'
          : undefined
    }
    setAppointments([...appointments, appointment])
    setIsAddingAppointment(false)
  }

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
  }

  const dateHasAppointment = (date: Date) => {
    return appointments.some(
      (apt) => apt.date === date.toISOString().split('T')[0]
    )
  }

  // Don't render until after hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="container-wrapper">
      <div className="flex justify-end mb-6">
        <Dialog
          open={isAddingAppointment}
          onOpenChange={setIsAddingAppointment}
        >
          <DialogTrigger asChild>
            <Button className="action-button">Schedule Appointment</Button>
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
              <Button type="submit" className="action-button">
                Schedule
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <Card className="bg-card">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => dateHasAppointment(date)
              }}
              modifiersStyles={{
                booked: { backgroundColor: 'var(--primary)', color: 'white' }
              }}
            />
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Upcoming Appointments</h4>
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {appointments?.map((appointment) => (
              <Card
                key={appointment.id}
                className="group bg-card hover:bg-accent/5 transition-colors"
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {new Date(appointment.date).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          }
                        )}{' '}
                        at {appointment.time}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {appointment.patientName} - {appointment.type}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span>Duration:</span>
                        <span className="text-foreground">
                          {appointment.duration}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span>Status:</span>
                        <span
                          className={`text-foreground ${
                            appointment.status === 'Confirmed'
                              ? 'text-green-500'
                              : ''
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </span>
                    </div>
                    {appointment.zoomLink && (
                      <div>
                        <a
                          href={appointment.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                        >
                          Join Telehealth Session
                        </a>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="text-sm text-muted-foreground">
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
    </div>
  )
}
