/**
 * VisitCalendar Component
 *
 * A comprehensive calendar interface for managing patient visits.
 * Features include:
 * - Calendar view with visit indicators
 * - List of upcoming visits
 * - Ability to schedule new visits
 * - Edit and cancel existing visits
 * - Support for both in-person and telehealth visits
 */

'use client'

import type { Visit } from '@api/models/Visit'
import { VisitStatusEnum } from '@api/models/VisitStatusEnum'
import { VisitTypeEnum } from '@api/models/VisitTypeEnum'
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

interface VisitWithPatient extends Visit {
  patientName: string
}

// Mock data for upcoming visits - TODO: Replace with API call
const mockUpcomingVisits: VisitWithPatient[] = [
  {
    id: 1,
    date: '2024-01-04',
    time: '09:00',
    type: VisitTypeEnum.IN_PERSON,
    status: VisitStatusEnum.SCHEDULED,
    patientName: 'John Doe',
    notes: 'Regular check-up visit',
    zoom_link: null
  },
  {
    id: 2,
    date: '2024-01-05',
    time: '14:30',
    type: VisitTypeEnum.TELEHEALTH,
    status: VisitStatusEnum.SCHEDULED,
    patientName: 'Jane Smith',
    notes: 'Follow-up consultation',
    zoom_link: 'https://zoom.us/j/example'
  },
  {
    id: 3,
    date: '2024-01-08',
    time: '11:00',
    type: VisitTypeEnum.IN_PERSON,
    status: VisitStatusEnum.SCHEDULED,
    patientName: 'Mike Johnson',
    notes: 'Annual physical examination',
    zoom_link: null
  },
  {
    id: 4,
    date: '2024-01-10',
    time: '13:15',
    type: VisitTypeEnum.TELEHEALTH,
    status: VisitStatusEnum.SCHEDULED,
    patientName: 'Sarah Williams',
    notes: 'Medication review and consultation',
    zoom_link: 'https://zoom.us/j/example'
  },
  {
    id: 5,
    date: '2024-01-12',
    time: '10:30',
    type: VisitTypeEnum.IN_PERSON,
    status: VisitStatusEnum.SCHEDULED,
    patientName: 'Robert Brown',
    notes: 'Initial consultation',
    zoom_link: null
  }
]

interface VisitCalendarProps {
  initialDate?: Date
  onVisitCreate?: (visit: VisitWithPatient) => void
  onVisitCancel?: (visitId: number) => void
  onVisitEdit?: (visit: VisitWithPatient) => void
}

export function VisitCalendar({
  initialDate,
  onVisitCreate,
  onVisitCancel
}: VisitCalendarProps) {
  const [mounted, setMounted] = useState(false)
  const [visits, setVisits] = useState<VisitWithPatient[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isAddingVisit, setIsAddingVisit] = useState(false)

  // Initialize state after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setVisits(mockUpcomingVisits)
    setSelectedDate(initialDate || new Date())
  }, [initialDate])

  /**
   * Handles the submission of a new visit
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const visit: VisitWithPatient = {
      id: Date.now(),
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as VisitTypeEnum,
      status: VisitStatusEnum.SCHEDULED,
      patientName: 'New Patient', // TODO: Replace with actual patient selection
      notes: formData.get('notes') as string,
      zoom_link:
        formData.get('type') === VisitTypeEnum.TELEHEALTH
          ? 'https://zoom.us/j/example'
          : null
    }

    setVisits([...visits, visit])
    setIsAddingVisit(false)
    onVisitCreate?.(visit)
  }

  /**
   * Handles the cancellation of an existing visit
   */
  const handleCancelVisit = (id: number) => {
    setVisits(visits.filter((visit) => visit.id !== id))
    onVisitCancel?.(id)
  }

  /**
   * Checks if a given date has any visits
   */
  const dateHasVisit = (date: Date) => {
    return visits.some(
      (visit) => visit.date === date.toISOString().split('T')[0]
    )
  }

  // Don't render until after hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="container-wrapper">
      <div className="flex justify-end mb-6">
        <Dialog open={isAddingVisit} onOpenChange={setIsAddingVisit}>
          <DialogTrigger asChild>
            <Button className="action-button">Schedule Visit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Visit</DialogTitle>
              <DialogDescription>
                Enter the visit details below
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
                  <Label htmlFor="type">Visit Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VisitTypeEnum.IN_PERSON}>
                        In-Person
                      </SelectItem>
                      <SelectItem value={VisitTypeEnum.TELEHEALTH}>
                        Telehealth
                      </SelectItem>
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
                booked: (date) => dateHasVisit(date)
              }}
              modifiersStyles={{
                booked: { backgroundColor: 'var(--primary)', color: 'white' }
              }}
            />
          </CardContent>
        </Card>

        {/* Upcoming Visits */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Upcoming Visits</h4>
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {visits?.map((visit) => (
              <Card
                key={visit.id}
                className="group bg-card hover:bg-accent/5 transition-colors"
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {new Date(visit.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}{' '}
                        at {visit.time}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {visit.patientName} - {visit.type}
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
                        onClick={() => handleCancelVisit(visit.id)}
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
                        <span>Status:</span>
                        <span
                          className={`text-foreground ${
                            visit.status === VisitStatusEnum.COMPLETED
                              ? 'text-green-500'
                              : ''
                          }`}
                        >
                          {visit.status}
                        </span>
                      </span>
                    </div>
                    {visit.zoom_link && (
                      <div>
                        <a
                          href={visit.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                        >
                          Join Telehealth Session
                        </a>
                      </div>
                    )}
                    {visit.notes && (
                      <div className="text-sm text-muted-foreground">
                        {visit.notes}
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
