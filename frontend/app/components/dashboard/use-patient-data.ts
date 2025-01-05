/**
 * Custom hook for managing patient data with search and pagination
 */

import { formatPatientData } from '@actions/patient/format-patient-action'
import { getPatients } from '@actions/patient/get-patients-action'
import { searchPatients } from '@actions/patient/patient-search-action'
import type { DashboardData } from '@api/dashboard'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

interface UsePatientDataProps {
  initialData: {
    data: DashboardData[]
    total: number
    page: number
    pageSize: number
  }
}

export function usePatientData({ initialData }: UsePatientDataProps) {
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
        } else if (query.length === 0) {
          // Use getPatients for pagination
          const response = await getPatients(page, pageSize)
          const formattedData = await Promise.all(
            response.results.map(formatPatientData)
          )

          setData({
            data: formattedData,
            total: response.count,
            page,
            pageSize
          })
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
