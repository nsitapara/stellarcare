'use client'

import { getInsurance } from '@actions/patient/get-insurance-action'
import type { Insurance } from '@api/models/Insurance'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface InsuranceCardProps {
  /** The unique identifier of the insurance record to display */
  insuranceId: string
}

/**
 * InsuranceCard Component
 *
 * Displays detailed insurance information in a card format, including provider details,
 * policy information, and authorization status.
 *
 * @param {InsuranceCardProps} props - The component props
 * @returns {JSX.Element} A card displaying insurance information
 */
export function InsuranceCard({ insuranceId }: InsuranceCardProps) {
  const [insurance, setInsurance] = useState<Insurance | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInsurance() {
      try {
        const data = await getInsurance(insuranceId)
        setInsurance(data as Insurance)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load insurance'
        )
      }
    }

    fetchInsurance()
  }, [insuranceId])

  if (error) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!insurance) {
    return (
      <Card className="form-card bg-card">
        <CardContent className="pt-6">
          <div className="text-muted-foreground">Loading insurance...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="form-card bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-foreground">
            {insurance.provider}
          </CardTitle>
          {insurance.authorization_status && (
            <Badge
              variant={
                insurance.authorization_status === 'Approved'
                  ? 'default'
                  : insurance.authorization_status === 'Pending'
                    ? 'outline'
                    : 'destructive'
              }
            >
              {insurance.authorization_status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Policy Number</dt>
            <dd className="text-foreground">{insurance.policy_number}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Group Number</dt>
            <dd className="text-foreground">{insurance.group_number}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Primary Holder</dt>
            <dd className="text-foreground">{insurance.primary_holder}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Relationship</dt>
            <dd className="text-foreground">{insurance.relationship}</dd>
          </div>
          {insurance.authorization_expiry && (
            <div>
              <dt className="text-sm text-muted-foreground">
                Authorization Expiry
              </dt>
              <dd className="text-foreground">
                {format(
                  new Date(insurance.authorization_expiry),
                  'MMMM d, yyyy'
                )}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
