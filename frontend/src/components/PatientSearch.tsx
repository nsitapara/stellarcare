import type React from 'react'
import { useState } from 'react'

export const PatientSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // If input is numeric, only search by exact ID
    if (/^\d+$/.test(value)) {
      onSearch({ search: value }) // Will trigger exact ID match on backend
    } else {
      onSearch({ search: value }) // Will trigger name search on backend
    }
  }

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name or exact patient ID"
        className="search-input"
      />
    </div>
  )
}
