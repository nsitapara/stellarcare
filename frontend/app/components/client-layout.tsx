'use client'

import { ThemeToggle } from '@components/theme-toggle'
import { UserSession } from '@components/user-session'
import { SessionProvider, useSession } from 'next-auth/react'
import '@/app/styles/globals.css'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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

function NavigationBar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const triggerAnimation = useCallback(() => {
    setShouldAnimate(true)
    const timer = setTimeout(() => {
      setShouldAnimate(false)
    }, 700)
    return timer
  }, [])

  useEffect(() => {
    // Initial animation on mount
    const timer = triggerAnimation()
    return () => clearTimeout(timer)
  }, [triggerAnimation])

  const handleLogoClick = () => {
    if (session) {
      router.push('/dashboard')
      triggerAnimation()
    } else {
      router.push('/')
      triggerAnimation()
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    triggerAnimation()
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
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
            className="text-foreground hover:text-primary flex items-center gap-2"
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
            className="text-foreground hover:text-primary flex items-center gap-2"
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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NavigationBar />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-6 text-foreground">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
