'use client'

/**
 * Client Layout Component
 *
 * This component serves as the main layout wrapper for client-side rendered pages.
 * It provides:
 * - Navigation bar with responsive design
 * - Theme toggle functionality with animation
 * - User session management
 * - Dynamic routing based on authentication state
 * - Logo with animated moon icon
 */

import { Footer } from '@components/layout/footer'
import { ThemeToggle } from '@components/theme-toggle'
import { UserSession } from '@components/user-session'
import { SessionProvider, useSession } from 'next-auth/react'
import '@styles/globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

/**
 * MoonIcon Component
 *
 * A custom SVG moon icon that serves as the application logo.
 * Features gradient fills and animation capabilities.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.animate - Controls animation state of the icon
 */
function MoonIcon({ animate }: { animate: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`moon-icon ${animate ? 'animate-fill' : ''}`}
      role="img"
      aria-label="StellarCare Logo"
    >
      <title>StellarCare Logo</title>
      <defs>
        <linearGradient
          id="moonGradient"
          x1="100%"
          y1="100%"
          x2="0%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" className="gradient-stop-1" />
          <stop offset="50%" className="gradient-stop-2" />
          <stop offset="100%" className="gradient-stop-3" />
        </linearGradient>
      </defs>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        className="moon-path"
      />
    </svg>
  )
}

/**
 * NavigationBar Component
 *
 * Main navigation component that provides:
 * - Responsive navigation links
 * - Theme toggle with animation
 * - User session management
 * - Dynamic routing based on authentication
 * - Animated logo transitions
 *
 * Features:
 * - Animates logo on route changes
 * - Animates logo on theme changes
 * - Responsive design with mobile considerations
 * - Accessible navigation elements
 */
function NavigationBar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isDark, setIsDark] = useState(true) // Default to dark to match server
  const [lastPathname, setLastPathname] = useState(pathname)

  const triggerAnimation = useCallback(() => {
    setShouldAnimate(true)
    const timer = setTimeout(() => {
      setShouldAnimate(false)
    }, 700)
    return timer
  }, [])

  // Watch for route changes
  useEffect(() => {
    if (pathname !== lastPathname) {
      setLastPathname(pathname)
      triggerAnimation()
    }
  }, [pathname, lastPathname, triggerAnimation])

  // Watch for theme changes and persist them
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isSystemDark = savedTheme === 'dark'
      setIsDark(isSystemDark)
      document.documentElement.classList.toggle('dark', isSystemDark)
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.target instanceof HTMLElement &&
          mutation.attributeName === 'class'
        ) {
          const isDarkMode = mutation.target.classList.contains('dark')
          if (isDark !== isDarkMode) {
            setIsDark(isDarkMode)
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
            triggerAnimation()
          }
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [isDark, triggerAnimation])

  const handleLogoClick = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="bg-card border-b border-border relative z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Go to home page"
        >
          <MoonIcon animate={shouldAnimate} />
          <span className="text-xl font-semibold text-foreground">
            StellarCare
          </span>
        </button>
        <div className="hidden md:flex items-center space-x-8">
          <button
            type="button"
            onClick={() => handleNavigation('/dashboard')}
            className="text-foreground hover:text-primary flex items-center gap-2 cursor-pointer relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Dashboard"
            >
              <title>Dashboard</title>
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/appointments')}
            className="text-foreground hover:text-primary flex items-center gap-2 cursor-pointer relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Appointments"
            >
              <title>Appointments</title>
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Appointments
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserSession />
        </div>
      </div>
    </nav>
  )
}

/**
 * ClientLayout Component
 *
 * The root layout component that wraps the application content.
 * Provides session management and consistent layout structure.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render within the layout
 *
 * Features:
 * - Session provider for authentication
 * - Consistent navigation across pages
 * - Responsive container sizing
 * - Theme-aware styling
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NavigationBar />
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <main className="container mx-auto py-4 text-foreground flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  )
}
