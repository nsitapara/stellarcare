'use client'

import { AppointmentCalendar } from '@components/AppointmentCalendar'

export default function AppointmentsPage() {
  return (
    <div className="container-wrapper py-8">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Appointments</h1>
        <p className="dashboard-subtitle">
          Manage and schedule patient appointments
        </p>
      </div>

      <div className="bg-background rounded-lg">
        <AppointmentCalendar />
      </div>
    </div>
  )
}
