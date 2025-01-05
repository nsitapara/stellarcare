import { format, isValid, parse, parseISO } from 'date-fns'

export function formatDate(dateString: string) {
  if (!dateString) return 'No date'

  try {
    // Try parsing as YYYY-MM-DD first
    let date = parse(dateString, 'yyyy-MM-dd', new Date())
    if (!isValid(date)) {
      // If that fails, try parsing as ISO
      date = parseISO(dateString)
      if (!isValid(date)) return 'Invalid date'
    }
    // Use UTC to ensure consistent formatting between server and client
    return format(date, 'MMMM d, yyyy', { timeZone: 'UTC' })
  } catch {
    return 'Invalid date'
  }
}
