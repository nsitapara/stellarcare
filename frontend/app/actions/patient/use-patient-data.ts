/**
 * Custom hook for managing patient data with search and pagination
 *
 * Features:
 * - Server-side pagination
 * - Search functionality with server-side filtering
 * - Loading and error states
 * - Data caching and state management
 */

import { formatPatientData } from '@actions/patient/format-patient-action'
import { getPatients } from '@actions/patient/get-patients-action'
import { searchPatients } from '@actions/patient/patient-search-action'
import type { UsePatientDataProps, UsePatientDataReturn } from '@api/dashboard'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

/**
 * Hook for managing patient data state and interactions
 * @param initialData - Initial patient data and pagination state
 * @returns Object containing data, loading state, error state, and data fetching functions
 */
export function usePatientData({
  initialData
}: UsePatientDataProps): UsePatientDataReturn {
  const { data: session } = useSession()
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(
    async (page: number, pageSize: number, query: string) => {
      if (!session) return

      setLoading(true)
      setError(null)

      try {
        // Use search endpoint if query is provided and long enough
        if (query && query.length >= 3) {
          const patients = await searchPatients(query)
          const formattedData = await Promise.all(
            patients.map(formatPatientData)
          )

          setData({
            data: formattedData,
            total: patients.length,
            page: 1,
            pageSize
          })
        } else {
          // Regular pagination fetch
          const response = await getPatients(page, pageSize)
          const formattedData = await Promise.all(
            response.results.map(formatPatientData)
          )

          const newData = {
            data: formattedData,
            total: response.count,
            page,
            pageSize
          }
          setData(newData)
        }
      } catch (err) {
        setError('Failed to fetch patient data')
        console.error('Error fetching patient data:', err)
      } finally {
        setLoading(false)
      }
    },
    [session]
  )

  return {
    data,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchData
  }
}
