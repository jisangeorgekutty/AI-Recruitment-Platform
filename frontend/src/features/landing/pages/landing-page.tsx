import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/types'
import { LandingHeader } from '@/features/landing/components/landing-header'
import { HeroSection } from '@/features/landing/components/hero-section'
import { TrustSection } from '@/features/landing/components/trust-section'
import { FeaturesSection } from '@/features/landing/components/features-section'
import { HowItWorksSection } from '@/features/landing/components/how-it-works-section'
import { DashboardPreviewSection } from '@/features/landing/components/dashboard-preview-section'
import { WhyChooseSection } from '@/features/landing/components/why-choose-section'
import { TestimonialsSection } from '@/features/landing/components/testimonials-section'
import { PricingSection } from '@/features/landing/components/pricing-section'
import { FAQSection } from '@/features/landing/components/faq-section'
import { FinalCTASection } from '@/features/landing/components/final-cta-section'
import { LandingFooter } from '@/features/landing/components/landing-footer'

const getDashboardRoute = (role: User['role']) => {
  switch (role) {
    case 'candidate': return '/candidate/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/recruiter/dashboard'
  }
}

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role), { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  if (isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
