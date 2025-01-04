'use client'

import { Button } from '@components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'

export function UserSession() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="text-sm text-white/80">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <Button variant="outline" onClick={() => signIn()}>
        Sign In
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-white">
        {session?.user?.username || session?.user?.email}
      </span>
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  )
}
