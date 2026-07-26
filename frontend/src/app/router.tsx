import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { CandidateLayout } from '@/features/candidate/layouts/candidate-layout'
import { AdminLayout } from '@/features/admin/layouts/admin-layout'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'
import { OnboardingGuard } from '@/components/onboarding-guard'

const LandingPage = lazy(() => import('@/features/landing/pages/landing-page'))
const LoginPage = lazy(() => import('@/features/auth/pages/login-page'))
const RegisterPage = lazy(() => import('@/features/auth/pages/register-page'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/forgot-password-page'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/reset-password-page'))

// Onboarding Pages
const CandidateOnboardingPage = lazy(() => import('@/features/onboarding/pages/candidate-onboarding-page'))
const RecruiterOnboardingPage = lazy(() => import('@/features/onboarding/pages/recruiter-onboarding-page'))

const DashboardPage = lazy(() => import('@/features/dashboard/pages/dashboard-page'))
const JobsListPage = lazy(() => import('@/features/jobs/pages/jobs-list-page'))
const JobCreatePage = lazy(() => import('@/features/jobs/pages/job-create-page'))
const JobDetailPage = lazy(() => import('@/features/jobs/pages/job-detail-page'))
const CandidatesListPage = lazy(() => import('@/features/applicants/pages/candidates-list-page'))
const RecruiterCandidateProfilePage = lazy(() => import('@/features/applicants/pages/candidate-profile-page'))
const CandidatePipelinePage = lazy(() => import('@/features/applicants/pages/candidate-pipeline-page'))
const InterviewsPage = lazy(() => import('@/features/interviews/pages/interviews-page'))
const ResumeParserPage = lazy(() => import('@/features/resume/pages/resume-parser-page'))
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/analytics-page'))
const NotificationsPage = lazy(() => import('@/features/notifications/pages/notifications-page'))
const SettingsPage = lazy(() => import('@/features/settings/pages/settings-page'))
const CompanyPage = lazy(() => import('@/features/company/pages/company-page'))

// Candidate Pages
const CandidateDashboardPage = lazy(() => import('@/features/candidate/pages/dashboard-page'))
const CandidateApplicationsPage = lazy(() => import('@/features/candidate/pages/applications-page'))
const CandidateJobSearchPage = lazy(() => import('@/features/candidate/pages/job-search-page'))
const CandidateSavedJobsPage = lazy(() => import('@/features/candidate/pages/saved-jobs-page'))
const CandidateResumePage = lazy(() => import('@/features/candidate/pages/resume-page'))
const CandidateProfilePage = lazy(() => import('@/features/candidate/pages/profile-page'))
const CandidateInterviewsPage = lazy(() => import('@/features/candidate/pages/interviews-page'))
const CandidateInterviewHistoryPage = lazy(() => import('@/features/candidate/pages/interview-history-page'))
const CandidateOffersPage = lazy(() => import('@/features/candidate/pages/offers-page'))
const CandidateNotificationsPage = lazy(() => import('@/features/candidate/pages/notifications-page'))
const CandidateSettingsPage = lazy(() => import('@/features/candidate/pages/settings-page'))

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/dashboard-page'))
const AdminUsersPage = lazy(() => import('@/features/admin/pages/users-page'))
const AdminCompaniesPage = lazy(() => import('@/features/admin/pages/companies-page'))
const AdminPlansPage = lazy(() => import('@/features/admin/pages/plans-page'))
const AdminPaymentsPage = lazy(() => import('@/features/admin/pages/payments-page'))
const AdminAuditLogsPage = lazy(() => import('@/features/admin/pages/audit-logs-page'))
const AdminSettingsPage = lazy(() => import('@/features/admin/pages/settings-page'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSkeleton type="detail" />}>
      {children}
    </Suspense>
  )
}

function getDefaultDashboard(role: string | undefined): string {
  switch (role) {
    case 'candidate': return '/candidate/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/recruiter/dashboard'
  }
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const stored = localStorage.getItem('hiregen-auth')
  if (!stored) {
    return <Navigate to="/login" replace />
  }
  try {
    const parsed = JSON.parse(stored)
    const role = parsed?.state?.user?.role
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      return <Navigate to={getDefaultDashboard(role)} replace />
    }
  } catch { }
  return <OnboardingGuard>{children}</OnboardingGuard>
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: '/register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      { path: '/forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: '/reset-password', element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '/candidate/onboarding',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <SuspenseWrapper><CandidateOnboardingPage /></SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/recruiter/onboarding',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
        <SuspenseWrapper><RecruiterOnboardingPage /></SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/recruiter',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/recruiter/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      {
        path: 'jobs',
        element: <ErrorBoundary><SuspenseWrapper><JobsListPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'jobs/new',
        element: <ErrorBoundary><SuspenseWrapper><JobCreatePage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'jobs/:id',
        element: <ErrorBoundary><SuspenseWrapper><JobDetailPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'candidates',
        element: <ErrorBoundary><SuspenseWrapper><CandidatesListPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'candidates/pipeline',
        element: <ErrorBoundary><SuspenseWrapper><CandidatePipelinePage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'candidates/:id',
        element: <ErrorBoundary><SuspenseWrapper><RecruiterCandidateProfilePage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'interviews',
        element: <ErrorBoundary><SuspenseWrapper><InterviewsPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'resume-analysis',
        element: <ErrorBoundary><SuspenseWrapper><ResumeParserPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'analytics',
        element: <ErrorBoundary><SuspenseWrapper><AnalyticsPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'notifications',
        element: <ErrorBoundary><SuspenseWrapper><NotificationsPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'settings',
        element: <ErrorBoundary><SuspenseWrapper><SettingsPage /></SuspenseWrapper></ErrorBoundary>,
      },
      {
        path: 'company',
        element: <ErrorBoundary><SuspenseWrapper><CompanyPage /></SuspenseWrapper></ErrorBoundary>,
      },
    ],
  },
  {
    path: '/candidate',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <CandidateLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/candidate/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><CandidateDashboardPage /></SuspenseWrapper> },
      { path: 'applications', element: <SuspenseWrapper><CandidateApplicationsPage /></SuspenseWrapper> },
      { path: 'jobs', element: <SuspenseWrapper><CandidateJobSearchPage /></SuspenseWrapper> },
      { path: 'saved-jobs', element: <SuspenseWrapper><CandidateSavedJobsPage /></SuspenseWrapper> },
      { path: 'resume', element: <SuspenseWrapper><CandidateResumePage /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><CandidateProfilePage /></SuspenseWrapper> },
      { path: 'interviews', element: <SuspenseWrapper><CandidateInterviewsPage /></SuspenseWrapper> },
      { path: 'interview-history', element: <SuspenseWrapper><CandidateInterviewHistoryPage /></SuspenseWrapper> },
      { path: 'offers', element: <SuspenseWrapper><CandidateOffersPage /></SuspenseWrapper> },
      { path: 'notifications', element: <SuspenseWrapper><CandidateNotificationsPage /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><CandidateSettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
      { path: 'users', element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper> },
      { path: 'companies', element: <SuspenseWrapper><AdminCompaniesPage /></SuspenseWrapper> },
      { path: 'plans', element: <SuspenseWrapper><AdminPlansPage /></SuspenseWrapper> },
      { path: 'payments', element: <SuspenseWrapper><AdminPaymentsPage /></SuspenseWrapper> },
      { path: 'audit-logs', element: <SuspenseWrapper><AdminAuditLogsPage /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><AdminSettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

export const router = createBrowserRouter(routes)
