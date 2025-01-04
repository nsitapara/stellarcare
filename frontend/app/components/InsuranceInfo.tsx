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
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(
    null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newInsurance: Insurance = {
      id: crypto.randomUUID(),
      provider: formData.get('provider') as string,
      policyNumber: formData.get('policyNumber') as string,
      groupNumber: formData.get('groupNumber') as string,
      primaryHolder: formData.get('primaryHolder') as string,
      relationship: formData.get('relationship') as string,
      authorizationStatus: '',
      authorizationExpiry: ''
    }
    onAddInsurance(newInsurance)
    e.currentTarget.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
        <CardDescription>Add or update insurance details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-foreground">
                Insurance Provider
              </Label>
              <Input id="provider" name="provider" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber" className="text-foreground">
                Policy Number
              </Label>
              <Input id="policyNumber" name="policyNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupNumber" className="text-foreground">
                Group Number
              </Label>
              <Input id="groupNumber" name="groupNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryHolder" className="text-foreground">
                Primary Holder Name
              </Label>
              <Input id="primaryHolder" name="primaryHolder" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-foreground">
                Relationship to Primary
              </Label>
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
          </div>
          <Button type="submit" className="w-full">
            Add Insurance
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
