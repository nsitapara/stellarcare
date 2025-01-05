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
