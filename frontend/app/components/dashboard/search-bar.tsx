/**
 * Search Bar Component
 *
 * A reusable search component with validation and loading state.
 */

'use client'

import { cn } from '@components/lib/utils'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

/**
 * Validates search input based on type (ID or name)
 *
 * @param value - Search query value
 * @returns Object containing validation state and error message
 */
const validateSearch = (value: string) => {
  if (value.length === 0) {
    return { isValid: true, message: '' }
  }

  if (/^\d+$/.test(value)) {
    return {
      isValid: value.length === 6,
      message: 'Please enter all 6 digits of the patient ID'
    }
  }

  return {
    isValid: value.length >= 3,
    message: 'Please enter at least 3 characters to search by name'
  }
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchValid, setIsSearchValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const { isValid, message } = validateSearch(value)
    setIsSearchValid(isValid)
    setErrorMessage(message)

    if (value.length === 0 || isValid) {
      onSearch(value)
    }
  }

  return (
    <div className="dashboard-search">
      <Search className="dashboard-search-icon" />
      <input
        type="text"
        placeholder="Search by name (min 3 chars) or patient ID (6 digits)..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn(
          'dashboard-search-input',
          !isSearchValid &&
            searchQuery.length > 0 &&
            'border-red-500 focus:border-red-500 focus:ring-red-500/30'
        )}
      />
      {isLoading && (
        <div className="absolute right-8 top-[1.75rem]">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent" />
        </div>
      )}
      {!isSearchValid && searchQuery.length > 0 && (
        <p className="mt-2 text-sm text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  )
}
