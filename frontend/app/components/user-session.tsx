'use client'

import { Button } from '@components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'

export function UserSession() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="text-sm text-white/80">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <Button onClick={() => signIn()}>Sign In</Button>
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => signOut()} className="flex items-center gap-2">
        {session?.user?.username?.split('@')[0]}
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
          aria-label="Sign out"
        >
          <title>Sign out</title>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </Button>
    </div>
  )
}
