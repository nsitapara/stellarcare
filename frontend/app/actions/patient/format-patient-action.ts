'use server'

import type { DashboardData } from '@api/dashboard'
import type { Address } from '@api/models/Address'
import type { Patient } from '@api/models/Patient'

function formatAddress(addr: Address): string {
  return (
    addr.formatted_address ||
    `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip_code}`
  )
}

export async function formatPatientData(
  patient: Patient
): Promise<DashboardData> {
  return {
    id: String(patient.id),
    first: patient.first || '',
    middle: patient.middle || '',
    last: patient.last || '',
    status: patient.status || '',
    date_of_birth: patient.date_of_birth || '',
    created_at: patient.created_at || '',
    addresses: patient.addresses?.map(formatAddress) || []
  }
}
