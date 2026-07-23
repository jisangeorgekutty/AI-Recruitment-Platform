import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/logo'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - Branding */}
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary/5 via-primary/10 to-background p-12 lg:flex">
        <Logo size="lg" />
        <div className="max-w-md">
          <blockquote className="space-y-2">
            <p className="text-2xl font-semibold leading-snug tracking-tight">
              "The best recruitment decisions are powered by data, driven by AI, and delivered with precision."
            </p>
            <footer className="text-sm text-muted-foreground">
              HireGen AI Platform
            </footer>
          </blockquote>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HireGen AI. All rights reserved.
        </div>
      </div>

      {/* Right panel - Auth forms */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
