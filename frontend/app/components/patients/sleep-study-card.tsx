'use client'

import { getSleepStudy } from '@actions/patient/get-sleep-study-action'
import type { SleepStudy } from '@api/models/SleepStudy'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

/**
 * Displays detailed information about a patient's sleep study in a card format.
 * Fetches sleep study data based on the provided study ID and renders various metrics
 * including AHI, sleep efficiency, and REM latency.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.studyId - Unique identifier for the sleep study to display
 *
 * @returns {JSX.Element} A card component displaying sleep study information or loading/error states
 *
 * @example
 * ```tsx
 * <SleepStudyCard studyId="123abc" />
 * ```
 */
export function SleepStudyCard({ studyId }: { studyId: string }) {
  const [study, setStudy] = useState<SleepStudy | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudy() {
      try {
        const data = await getSleepStudy(studyId)
        setStudy(data as SleepStudy)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load sleep study'
        )
      }
    }

    fetchStudy()
  }, [studyId])

  if (error) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!study) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-muted-foreground">Loading sleep study...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="form-card bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-foreground">Sleep Study Results</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(new Date(study.date), 'MMMM d, yyyy')}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">
              AHI (Apnea-Hypopnea Index)
            </dt>
            <dd className="text-foreground">{study.ahi} events/hour</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Sleep Efficiency</dt>
            <dd className="text-foreground">{study.sleep_efficiency}%</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">REM Latency</dt>
            <dd className="text-foreground">{study.rem_latency} minutes</dd>
          </div>
          {study.notes && (
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="text-foreground">{study.notes}</dd>
            </div>
          )}
          {study.file_url && (
            <div>
              <dt className="text-sm text-muted-foreground">Study Report</dt>
              <dd>
                <a
                  href={study.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-2"
                >
                  View Full Report
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="View Full Report Icon"
                  >
                    <title>View Full Report Icon</title>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                  </svg>
                </a>
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
