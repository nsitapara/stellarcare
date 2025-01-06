import { UserSession } from '@components/user-session'

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
 * Layout:
 * - Full viewport height minus header (120px)
 * - Centered content with maximum width
 * - Stacked layout with consistent spacing
 * - Muted secondary text for description
 *
 * @returns The landing page interface with authentication options
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to StellarCare
        </h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive healthcare management platform for sleep medicine
          professionals
        </p>
        <div className="flex justify-center gap-4">
          <UserSession />
        </div>
      </div>
    </div>
  )
}
