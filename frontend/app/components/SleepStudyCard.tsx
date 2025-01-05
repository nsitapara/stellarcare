'use client'

import { getSleepStudy } from '@/app/actions/get-sleep-study-action'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface SleepStudy {
  id: number
  date: string
  ahi: number
  sleep_efficiency: number
  rem_latency: number
  notes?: string
  file_url?: string
}

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
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!study) {
    return (
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-gray-400">Loading sleep study...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Sleep Study Results</CardTitle>
          <div className="text-sm text-gray-400">
            {format(new Date(study.date), 'MMMM d, yyyy')}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-gray-400">
              AHI (Apnea-Hypopnea Index)
            </dt>
            <dd className="text-white">{study.ahi} events/hour</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Sleep Efficiency</dt>
            <dd className="text-white">{study.sleep_efficiency}%</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">REM Latency</dt>
            <dd className="text-white">{study.rem_latency} minutes</dd>
          </div>
          {study.notes && (
            <div>
              <dt className="text-sm text-gray-400">Notes</dt>
              <dd className="text-white">{study.notes}</dd>
            </div>
          )}
          {study.file_url && (
            <div>
              <dt className="text-sm text-gray-400">Study Report</dt>
              <dd>
                <a
                  href={study.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View Full Report
                </a>
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
