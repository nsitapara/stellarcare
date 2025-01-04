'use client'

import { ThemeToggle } from '@components/theme-toggle'
import { UserSession } from '@components/user-session'
import { Moon } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import '@/app/styles/globals.css'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Moon className="h-6 w-6 text-foreground" />
            <span className="text-xl font-semibold text-foreground">
              StellarCare
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/dashboard" className="text-foreground hover:text-primary">
              Dashboard
            </a>
            <a
              href="/appointments"
              className="text-foreground hover:text-primary"
            >
              Appointments
            </a>
            <a href="/patients" className="text-foreground hover:text-primary">
              Patients
            </a>
            <a
              href="/medications"
              className="text-foreground hover:text-primary"
            >
              Medications
            </a>
            <a
              href="/sleep-assessment"
              className="text-foreground hover:text-primary"
            >
              Sleep Assessment
            </a>
            <a href="/insurance" className="text-foreground hover:text-primary">
              Insurance
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserSession />
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-6 text-foreground">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
