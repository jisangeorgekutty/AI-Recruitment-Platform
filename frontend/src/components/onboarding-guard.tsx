import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

interface OnboardingGuardProps {
  children: ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <>{children}</>
  }

  const isOnboardingRoute = location.pathname.includes('/onboarding')

  // If user has not completed onboarding and is trying to access standard routes
  if (user.isOnboardingCompleted === false && !isOnboardingRoute) {
    if (user.role === 'candidate') {
      return <Navigate to="/candidate/onboarding" replace />
    }
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter/onboarding" replace />
    }
  }

  // If user already completed onboarding and tries to visit onboarding page manually
  if (user.isOnboardingCompleted === true && isOnboardingRoute) {
    if (user.role === 'candidate') {
      return <Navigate to="/candidate/dashboard" replace />
    }
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />
    }
  }

  return <>{children}</>
}
