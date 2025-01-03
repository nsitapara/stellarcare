'use client'

import type { Insurance } from '@/types/patient'
import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'
import { useState } from 'react'

type InsuranceInfoProps = {
  insurance: Insurance[]
  onAddInsurance: (insurance: Insurance) => void
}

export function InsuranceInfo({
  insurance,
  onAddInsurance
}: InsuranceInfoProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newInsurance: Insurance = {
      id: Date.now().toString(),
      provider: formData.get('provider') as string,
      policyNumber: formData.get('policyNumber') as string,
      groupNumber: formData.get('groupNumber') as string,
      primaryHolder: formData.get('primaryHolder') as string,
      relationship: formData.get('relationship') as string,
      authorizationStatus: formData.get('authorizationStatus') as string,
      authorizationExpiry: formData.get('authorizationExpiry') as string
    }
    onAddInsurance(newInsurance)
    setIsAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Insurance Information</h3>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Insurance'}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>New Insurance</CardTitle>
            <CardDescription>Enter the insurance details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Insurance Provider</Label>
                  <Input id="provider" name="provider" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input id="policyNumber" name="policyNumber" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupNumber">Group Number</Label>
                  <Input id="groupNumber" name="groupNumber" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryHolder">Primary Holder Name</Label>
                  <Input id="primaryHolder" name="primaryHolder" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to Primary</Label>
                  <Select name="relationship">
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorizationStatus">
                    Authorization Status
                  </Label>
                  <Select name="authorizationStatus">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorizationExpiry">
                    Authorization Expiry
                  </Label>
                  <Input
                    type="date"
                    id="authorizationExpiry"
                    name="authorizationExpiry"
                  />
                </div>
              </div>
              <Button type="submit">Save Insurance</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {insurance?.map((ins) => (
          <Card key={ins.id}>
            <CardHeader>
              <CardTitle>{ins.provider}</CardTitle>
              <CardDescription>Policy: {ins.policyNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Group Number
                  </dt>
                  <dd>{ins.groupNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Primary Holder
                  </dt>
                  <dd>{ins.primaryHolder}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Relationship
                  </dt>
                  <dd className="capitalize">{ins.relationship}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Authorization Status
                  </dt>
                  <dd className="capitalize">{ins.authorizationStatus}</dd>
                </div>
                {ins.authorizationExpiry && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Authorization Expiry
                    </dt>
                    <dd>
                      {new Date(ins.authorizationExpiry).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
