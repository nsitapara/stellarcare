'use client'

import type { Patient } from '@api/models/Patient'
import { BasicInformation } from '@components/patients/basic-information'
import { InsuranceCard } from '@components/patients/insurance-card'
import { SleepStudyCard } from '@components/patients/sleep-study-card'
import { TreatmentCard } from '@components/patients/treatment-card'
import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { VisitCard } from '@components/visits/visit-card'
import { format, parseISO } from 'date-fns'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

/**
 * Props for the PatientTabs component
 */
interface PatientTabsProps {
  patient: Patient
}

/**
 * Formatted dates object structure
 */
interface FormattedDates {
  dateOfBirth: string
  created: string
  updated: string
}

/**
 * PatientTabs Component
 *
 * A comprehensive tabbed interface for displaying patient information. Provides
 * organized access to different aspects of patient data including basic information,
 * appointments, sleep studies, treatments, and insurance details.
 *
 * Features:
 * - Patient header with name, ID, and edit functionality
 * - Status indicator with appropriate styling
 * - Tabbed navigation for different categories of patient information
 * - Empty state handling for each category
 * - UTC date formatting for consistency
 *
 * @param {PatientTabsProps} props - The component props
 * @returns {JSX.Element} A tabbed interface displaying patient information
 */
export function PatientTabs({ patient }: PatientTabsProps) {
  // Format dates in UTC to ensure consistency between server and client
  const formattedDates: FormattedDates = {
    dateOfBirth: format(parseISO(patient.date_of_birth), 'MMMM d, yyyy'),
    created: format(parseISO(patient.created_at), 'MMMM d, yyyy'),
    updated: format(parseISO(patient.modified_at), 'MMMM d, yyyy')
  }

  /**
   * Determines the CSS class for the status badge based on patient status
   * @param {string} status - The patient's current status
   * @returns {string} The corresponding CSS class name
   */
  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active'
      case 'inquiry':
        return 'status-inquiry'
      case 'onboarding':
        return 'status-onboarding'
      case 'churned':
        return 'status-churned'
      default:
        return 'status-inquiry'
    }
  }

  return (
    <div className="form-card space-y-6">
      <div className="form-card-header">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="dashboard-title">
              {patient.first} {patient.middle} {patient.last}
            </h1>
            <p className="dashboard-subtitle">Patient ID: {patient.id}</p>
          </div>
          <Link href={`/patients/${patient.id}/edit`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit patient</span>
            </Button>
          </Link>
        </div>
        <div>
          <span
            className={`table-status-badge ${getStatusClass(patient.status)}`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="tabs-list">
          <TabsTrigger className="tabs-trigger" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="appointments">
            Past Visits
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="studies">
            Sleep Studies
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="treatments">
            Treatments
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="insurance">
            Insurance
          </TabsTrigger>
        </TabsList>
        <TabsContent className="tabs-content" value="overview">
          <div className="space-y-6">
            <BasicInformation
              patient={patient}
              formattedDates={formattedDates}
            />
          </div>
        </TabsContent>
        <TabsContent className="tabs-content" value="appointments">
          <div className="space-y-4">
            {patient.appointments?.length ? (
              patient.appointments.map((appointmentId) => (
                <VisitCard
                  key={appointmentId}
                  appointmentId={appointmentId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent className="tabs-content" value="studies">
          <div className="space-y-4">
            {patient.studies?.length ? (
              patient.studies.map((studyId) => (
                <SleepStudyCard key={studyId} studyId={studyId.toString()} />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No sleep studies found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent className="tabs-content" value="treatments">
          <div className="space-y-4">
            {patient.treatments?.length ? (
              patient.treatments.map((treatmentId) => (
                <TreatmentCard
                  key={treatmentId}
                  treatmentId={treatmentId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">No treatments found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent className="tabs-content" value="insurance">
          <div className="space-y-4">
            {patient.insurance?.length ? (
              patient.insurance.map((insuranceId) => (
                <InsuranceCard
                  key={insuranceId}
                  insuranceId={insuranceId.toString()}
                />
              ))
            ) : (
              <div className="form-card bg-card/50">
                <p className="text-muted-foreground">
                  No insurance information found
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
