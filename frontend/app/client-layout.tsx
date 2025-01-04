'use client'

import { UserSession } from '@components/user-session'
import { Moon } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import '@/app/styles/globals.css'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <nav className="bg-secondary p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <Moon className="h-6 w-6" />
            <span className="text-xl font-semibold">StellarCare</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/appointments" className="text-white hover:text-accent">
              Appointments
            </a>
            <a href="/patients" className="text-white hover:text-accent">
              Patients
            </a>
            <a href="/medications" className="text-white hover:text-accent">
              Medications
            </a>
            <a
              href="/sleep-assessment"
              className="text-white hover:text-accent"
            >
              Sleep Assessment
            </a>
            <a href="/insurance" className="text-white hover:text-accent">
              Insurance
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <UserSession />
          </div>
        </div>
      </nav>
      {/* <main className="container mx-auto py-6">{children}</main> */}
    </SessionProvider>
  )
}
