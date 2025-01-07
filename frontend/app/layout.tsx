import { ClientLayout } from '@components/client-layout'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import type { Metadata, Viewport } from 'next'

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  title: {
    template: '%s | StellarCare',
    default: 'StellarCare'
  },
  description: 'Modern healthcare management platform',
  icons: {
    icon: '/favicon.ico'
  }
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
