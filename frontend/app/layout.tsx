import { ClientLayout } from '@components/client-layout'
import { Inter } from 'next/font/google'
import './styles/globals.css'

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

/**
 * Application metadata configuration
 * Defines the title and description for SEO and browser display
 */
export const metadata = {
  title: 'StellarCare - Patient Management',
  description: 'A comprehensive healthcare management platform'
}

/**
 * Root Layout Component
 * Provides the base structure and styling for the entire application.
 *
 * Features:
 * - Sets up HTML document structure
 * - Configures Inter font for consistent typography
 * - Applies dark theme by default
 * - Provides responsive layout with minimum height
 * - Wraps content in ClientLayout for authentication and navigation
 *
 * @param props.children - The page content to be rendered within the layout
 * @returns The root layout structure for the application
 */
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
