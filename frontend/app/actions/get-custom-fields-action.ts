'use server'

import type { CustomFieldDefinition } from '@/types/api/models/CustomFieldDefinition'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

export async function getCustomFields(): Promise<CustomFieldDefinition[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view custom fields')
  }

  const api = await getApiClient(session)
  return api.request.request<CustomFieldDefinition[]>({
    method: 'GET',
    url: '/api/custom-field-definitions/'
  })
}

export async function createCustomField(data: {
  name: string
  type: 'text' | 'number'
  description?: string
}): Promise<CustomFieldDefinition> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to create custom fields')
  }

  const api = await getApiClient(session)
  return api.request.request<CustomFieldDefinition>({
    method: 'POST',
    url: '/api/custom-field-definitions/',
    body: {
      ...data,
      is_active: true,
      is_required: false,
      display_order: 0
    }
  })
}
