'use server'

import type { CustomFieldDefinition } from '@/types/api/models/CustomFieldDefinition'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getCustomFields(): Promise<CustomFieldDefinition[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view custom fields')
  }

  try {
    console.log('Fetching custom fields for user:', session.user?.email)
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<CustomFieldDefinition>
    >({
      method: 'GET',
      url: '/api/custom-field-definitions/'
    })
    console.log('Custom fields API response:', response)
    return response.results
  } catch (error) {
    console.error('Error fetching custom fields:', error)
    throw error
  }
}

export async function getUserCustomFields(): Promise<CustomFieldDefinition[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view custom fields')
  }

  try {
    console.log(
      'Fetching assigned custom fields for user:',
      session.user?.email
    )
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<CustomFieldDefinition>
    >({
      method: 'GET',
      url: '/api/custom-field-definitions/assigned/'
    })
    console.log('User custom fields API response:', response)
    return response.results
  } catch (error) {
    console.error('Error fetching user custom fields:', error)
    throw error
  }
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

  try {
    console.log('Creating custom field:', data)
    const api = await getApiClient(session)
    const response = await api.request.request<CustomFieldDefinition>({
      method: 'POST',
      url: '/api/custom-field-definitions/',
      body: {
        ...data,
        is_active: true,
        is_required: false,
        display_order: 0
      }
    })
    console.log('Create custom field response:', response)
    return response
  } catch (error) {
    console.error('Error creating custom field:', error)
    throw error
  }
}

export async function assignCustomFieldToUser(
  customFieldId: number
): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to assign custom fields')
  }

  try {
    console.log('Assigning custom field to user:', customFieldId)
    const api = await getApiClient(session)
    await api.request.request({
      method: 'POST',
      url: `/api/custom-field-definitions/${customFieldId}/assign/`
    })
    console.log('Successfully assigned custom field to user')
  } catch (error) {
    console.error('Error assigning custom field to user:', error)
    throw error
  }
}
