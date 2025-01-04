export type DashboardData = {
  id: string
  first: string
  last: string
  status: string
  date_of_birth: string
  created_at: string
}

export type PaginatedResponse = {
  data: DashboardData[]
  total: number
  page: number
  pageSize: number
}
