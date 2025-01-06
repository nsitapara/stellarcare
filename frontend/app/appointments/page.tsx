/**
 * Appointments Page
 *
 * This page provides a calendar interface for managing patient appointments.
 * It serves as the main hub for scheduling and viewing appointments across the practice.
 *
 * Features:
 * - Interactive calendar view of all appointments
 * - Ability to schedule new appointments
 * - View and manage existing appointments
 * - Filter and search appointment history
 *
 * @component
 * @example
 * // This page is automatically rendered at /appointments
 * // Usage in navigation:
 * <Link href="/appointments">Appointments</Link>
 */

'use client'

import { VisitCalendar } from '@components/visits/VisitCalendar'

/**
 * Main appointments page component.
 * Renders a dashboard layout with a calendar interface for appointment management.
 *
 * @returns {JSX.Element} The appointments page with calendar component
 */
export default function AppointmentsPage() {
  return (
    <div className="container-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Appointments</h1>
        <p className="dashboard-subtitle">
          Manage and schedule patient appointments
        </p>
      </div>

      <div className="bg-background rounded-lg">
        <VisitCalendar />
      </div>
    </div>
  )
}
