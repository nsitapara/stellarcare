'use client'

import { Button } from '@components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  // Toggle dark mode by adding/removing the 'dark' class on the html element
  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    const html = document.documentElement
    setIsDark(html.classList.contains('dark'))
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-gray-700 hover:bg-secondary"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
