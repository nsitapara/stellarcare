import { ClientLayout } from '@components/client-layout'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

/**
 * Application metadata configuration
 * Defines the title and description for SEO and browser display
 */
export const metadata: Metadata = {
  title: 'StellarCare - Patient Management',
  description: 'A comprehensive healthcare management platform',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml'
      }
    ]
  },
  manifest: '/manifest.json',
  applicationName: 'StellarCare',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StellarCare'
  },
  formatDetection: {
    telephone: true
  }
}

/**
 * Viewport configuration
 * Defines the viewport and theme settings for the application
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6366f1'
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
