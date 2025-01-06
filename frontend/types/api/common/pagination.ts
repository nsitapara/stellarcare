/**
 * Generic interface for paginated API responses
 * @interface PaginatedResponse
 * @template T - The type of items in the results array
 */
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
