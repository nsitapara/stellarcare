/**
 * Types and interfaces for the dashboard components and functionality
 */

/**
 * Represents a transformed patient record for dashboard display
 */
export interface DashboardData {
  id: string
  first: string
  middle: string
  last: string
  status: string
  date_of_birth: string
  created_at: string
  addresses: string[]
  customFields: Array<{
    name: string
    value: string | number
  }>
}

/**
 * Props for the dashboard table component
 */
export interface DashboardTableProps {
  data: DashboardData[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearch: (query: string) => void
  isLoading: boolean
}

/**
 * Props for the dashboard client component
 */
export interface DashboardClientProps {
  initialData: {
    data: DashboardData[]
    total: number
    page: number
    pageSize: number
  }
}

/**
 * Props for the patient table component
 */
export interface PatientTableProps {
  data: DashboardData[]
  onEdit: (id: string) => void
  onView: (id: string) => void
}

/**
 * Props for the search bar component
 */
export interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

/**
 * Props for the pagination component
 */
export interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  isLoading: boolean
  loadingPage: number | null
}

/**
 * Search validation result
 */
export interface SearchValidationResult {
  isValid: boolean
  message: string
}

/**
 * Patient data hook props
 */
export interface UsePatientDataProps {
  initialData: {
    data: DashboardData[]
    total: number
    page: number
    pageSize: number
  }
}

/**
 * Patient data hook return type
 */
export interface UsePatientDataReturn {
  data: {
    data: DashboardData[]
    total: number
    page: number
    pageSize: number
  }
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  fetchData: (page: number, pageSize: number, query: string) => Promise<void>
}
