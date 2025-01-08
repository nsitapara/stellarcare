'use server'

import type { PaginatedResponse } from '@api/common/pagination'
import type { CustomFieldDefinition } from '@api/models/CustomFieldDefinition'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'

/**
 * Fetches all custom field definitions from the API.
 * This is a server action that requires authentication.
 *
 * @returns {Promise<CustomFieldDefinition[]>} Array of custom field definitions
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 */
export async function getCustomFields(): Promise<CustomFieldDefinition[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view custom fields')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<CustomFieldDefinition>
    >({
      method: 'GET',
      url: '/api/custom-field-definitions/'
    })
    return response.results
  } catch (error) {
    console.error('Error fetching custom fields:', error)
    throw error
  }
}

/**
 * Fetches custom field definitions assigned to the current user.
 * This is a server action that requires authentication.
 *
 * @returns {Promise<CustomFieldDefinition[]>} Array of custom field definitions assigned to the user
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 */
export async function getUserCustomFields(): Promise<CustomFieldDefinition[]> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to view custom fields')
  }

  try {
    const api = await getApiClient(session)
    const response = await api.request.request<
      PaginatedResponse<CustomFieldDefinition>
    >({
      method: 'GET',
      url: '/api/custom-field-definitions/assigned/'
    })
    return response.results
  } catch (error) {
    console.error('Error fetching user custom fields:', error)
    throw error
  }
}

/**
 * Creates a new custom field definition.
 * This is a server action that requires authentication.
 *
 * @param {Object} data - The custom field data
 * @param {string} data.name - Name of the custom field
 * @param {'text' | 'number'} data.type - Type of the custom field
 * @param {string} [data.description] - Optional description of the custom field
 * @returns {Promise<CustomFieldDefinition>} The created custom field definition
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 */
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
    return response
  } catch (error) {
    console.error('Error creating custom field:', error)
    throw error
  }
}

/**
 * Assigns a custom field definition to the current user.
 * This is a server action that requires authentication.
 *
 * @param {number} customFieldId - ID of the custom field to assign
 * @returns {Promise<void>}
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 */
export async function assignCustomFieldToUser(
  customFieldId: number
): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to assign custom fields')
  }

  try {
    const api = await getApiClient(session)
    await api.request.request({
      method: 'POST',
      url: `/api/custom-field-definitions/${customFieldId}/assign/`
    })
  } catch (error) {
    console.error('Error assigning custom field to user:', error)
    throw error
  }
}

/**
 * Unassigns a custom field definition from the current user.
 * This is a server action that requires authentication.
 *
 * @param {number} customFieldId - ID of the custom field to unassign
 * @returns {Promise<void>}
 * @throws {Error} If user is not authenticated
 * @throws {Error} If the API request fails
 */
export async function unassignCustomFieldFromUser(
  customFieldId: number
): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('You must be logged in to unassign custom fields')
  }

  try {
    const api = await getApiClient(session)
    await api.request.request({
      method: 'DELETE',
      url: `/api/custom-field-definitions/${customFieldId}/assign/`
    })
  } catch (error) {
    console.error('Error unassigning custom field from user:', error)
    throw error
  }
}
