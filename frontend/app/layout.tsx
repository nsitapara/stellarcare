import { Button } from '@components/ui/button'
import { Moon } from 'lucide-react'
import { Inter } from 'next/font/google'
import '@/app/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Patient Management Dashboard',
  description: 'A comprehensive solution for managing patient data'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-secondary p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Moon className="h-6 w-6" />
              <span className="text-xl font-semibold">StellarCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-accent">
                Our Science
              </a>
              <a href="#" className="text-white hover:text-accent">
                Employers
              </a>
              <a href="#" className="text-white hover:text-accent">
                Clinicians
              </a>
              <a href="#" className="text-white hover:text-accent">
                Mission
              </a>
              <a href="#" className="text-white hover:text-accent">
                Help Center
              </a>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white">
              Take our health quiz
            </Button>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
