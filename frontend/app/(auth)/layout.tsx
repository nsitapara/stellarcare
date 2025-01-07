export default function AuthLayout({
  children
}: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] -mt-16">
      <div className="w-full max-w-md mx-auto px-4 animate-fade-in">
        {children}
      </div>
    </div>
  )
}
