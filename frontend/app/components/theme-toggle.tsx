'use client'

import { Button } from '@components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * A component that provides a toggle button for switching between light and dark themes.
 * The theme state is managed through the 'dark' class on the HTML element and persists across page reloads.
 *
 * Features:
 * - Displays a sun icon in dark mode and moon icon in light mode
 * - Maintains theme state using React useState
 * - Initializes theme state on component mount
 * - Provides screen reader accessibility with sr-only text
 *
 * @returns A button component that toggles between light and dark themes
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true) // Default to dark to match server

  // Toggle dark mode by adding/removing the 'dark' class on the html element
  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')

    if (newIsDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isSystemDark = savedTheme === 'dark'
      setIsDark(isSystemDark)
      document.documentElement.classList.toggle('dark', isSystemDark)
    }
  }, [])

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="border-gray-700 hover:bg-secondary w-9 h-9"
      >
        <span className="sr-only">Loading theme</span>
      </Button>
    )
  }

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
