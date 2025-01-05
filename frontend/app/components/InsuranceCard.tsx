'use client'

import { getInsurance } from '@/app/actions/get-insurance-action'
import { Badge } from '@/app/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface Insurance {
  id: number
  provider: string
  policy_number: string
  group_number: string
  primary_holder: string
  relationship: string
  authorization_status?: string
  authorization_expiry?: string
}

export function InsuranceCard({ insuranceId }: { insuranceId: string }) {
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
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!insurance) {
    return (
      <Card className="bg-gray-900">
        <CardContent className="pt-6">
          <div className="text-gray-400">Loading insurance...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{insurance.provider}</CardTitle>
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
            <dt className="text-sm text-gray-400">Policy Number</dt>
            <dd className="text-white">{insurance.policy_number}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Group Number</dt>
            <dd className="text-white">{insurance.group_number}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Primary Holder</dt>
            <dd className="text-white">{insurance.primary_holder}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Relationship</dt>
            <dd className="text-white">{insurance.relationship}</dd>
          </div>
          {insurance.authorization_expiry && (
            <div>
              <dt className="text-sm text-gray-400">Authorization Expires</dt>
              <dd className="text-white">
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
