export type DashboardData = {
  id: string
  first: string
  middle?: string | null
  last: string
  status: string
  date_of_birth: string
  created_at: string
  addresses: string[]
}

export type PaginatedResponse = {
  data: DashboardData[]
  total: number
  page: number
  pageSize: number
}
