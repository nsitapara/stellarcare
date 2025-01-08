import { UserSession } from '@components/user-session'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'StellarCare - Sleep Medicine Management Platform',
  description:
    'A comprehensive healthcare management platform for sleep medicine professionals'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1
}

/**
 * Home Page Component
 * Landing page for the StellarCare application.
 *
 * Features:
 * - Displays welcome message and application description
 * - Centers content vertically and horizontally
 * - Provides authentication interface through UserSession component
 * - Responsive text sizing for different screen sizes
 * - Maintains consistent spacing and layout
 *
 * @returns The landing page interface with authentication options
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] -mt-16">
      <div className="text-center space-y-8 max-w-3xl mx-auto px-4 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
          Welcome to StellarCare
        </h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive healthcare management platform for sleep medicine
          professionals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 rounded-lg border-2 border-border/60 dark:border-border/40 bg-card hover:border-primary/40 transition-all duration-300 animate-fade-up">
            <svg
              role="img"
              aria-label="Patient-Centric Care"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary mb-4"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Patient-Centric Care</h3>
            <p className="text-muted-foreground">
              Streamline patient management with comprehensive profiles, medical
              histories, and treatment plans.
            </p>
          </div>

          <div className="p-6 rounded-lg border-2 border-border/60 dark:border-border/40 bg-card hover:border-primary/40 transition-all duration-300 animate-fade-up [animation-delay:200ms]">
            <svg
              role="img"
              aria-label="Smart Scheduling"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary mb-4"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Efficiently manage appointments with our intuitive calendar system
              and automated reminders.
            </p>
          </div>

          <div className="p-6 rounded-lg border-2 border-border/60 dark:border-border/40 bg-card hover:border-primary/40 transition-all duration-300 animate-fade-up [animation-delay:400ms]">
            <svg
              role="img"
              aria-label="Sleep Analytics"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary mb-4"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Sleep Analytics</h3>
            <p className="text-muted-foreground">
              Track and analyze sleep patterns with advanced monitoring tools
              and detailed reports.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <UserSession />
        </div>
      </div>
    </div>
  )
}
