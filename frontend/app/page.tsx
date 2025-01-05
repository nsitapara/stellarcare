import { UserSession } from '@/app/components/user-session'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
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
