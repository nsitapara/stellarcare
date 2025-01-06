'use client'

import { Button } from '@components/ui/button'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * PatientHeader Component
 *
 * A header component for the patient details page that displays the title and
 * provides navigation functionality. Features a close button that redirects
 * users back to their previous location or dashboard.
 *
 * Features:
 * - Title and subtitle for patient details page
 * - Close button with hover effect
 * - Smart redirection based on URL parameters
 *
 * @returns {JSX.Element} A header component for the patient details page
 */
export function PatientHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Patient Details</h2>
        <p className="text-muted-foreground">View patient information</p>
      </div>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => {
          const redirectPath = searchParams.get('redirect') || '/dashboard'
          router.push(redirectPath)
        }}
        className="hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}
