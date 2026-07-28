import api from './api'
import type { ApiResponse, DashboardStats, Activity } from '@/types'
export type { DashboardStats, Activity }

export interface HiringFunnel {
  stage: string
  count: number
  color: string
}

export interface TimeToHireData {
  month: string
  days: number
}

export interface SourceBreakdown {
  source: string
  count: number
  percentage: number
}

export interface DiversityMetrics {
  category: string
  value: number
  label: string
}

const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalJobs: 24,
  activeJobs: 18,
  totalCandidates: 482,
  totalInterviews: 64,
  interviewsThisWeek: 12,
  offersSent: 14,
  acceptanceRate: 85,
  timeToHire: 16,
  applicationsThisMonth: 128,
  candidatesHired: 11,
  revenueImpact: 145000,
}

const MOCK_RECENT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'application_received',
    title: 'New Application Received',
    description: 'Sarah Chen applied for Senior Full Stack Engineer',
    user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    timestamp: '10 minutes ago',
  },
  {
    id: 'act-2',
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    description: 'AI & ML Technical round scheduled with Alex Rivera',
    user: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    timestamp: '25 minutes ago',
  },
  {
    id: 'act-3',
    type: 'offer_accepted',
    title: 'Offer Accepted',
    description: 'Michael Scott accepted offer for Backend Engineering Lead',
    user: { name: 'Michael Scott', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    timestamp: '2 hours ago',
  },
  {
    id: 'act-4',
    type: 'note_added',
    title: 'AI Resume Batch Scored',
    description: 'AI System scored 15 new resumes with average match 88%',
    user: { name: 'AI Recruitment System' },
    timestamp: '4 hours ago',
  },
  {
    id: 'act-5',
    type: 'job_published',
    title: 'Job Published',
    description: 'Lead Product Designer published to LinkedIn and Website',
    user: { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    timestamp: '1 day ago',
  },
]

const MOCK_HIRING_FUNNEL: HiringFunnel[] = [
  { stage: 'Sourced', count: 240, color: '#818cf8' },
  { stage: 'Applied', count: 180, color: '#a78bfa' },
  { stage: 'Screened', count: 95, color: '#c084fc' },
  { stage: 'Interviewed', count: 48, color: '#e879f9' },
  { stage: 'Technical', count: 26, color: '#f472b6' },
  { stage: 'Offered', count: 14, color: '#34d399' },
  { stage: 'Hired', count: 11, color: '#22d3ee' },
]

const MOCK_TIME_TO_HIRE: TimeToHireData[] = [
  { month: 'Jan', days: 24 },
  { month: 'Feb', days: 22 },
  { month: 'Mar', days: 19 },
  { month: 'Apr', days: 18 },
  { month: 'May', days: 15 },
  { month: 'Jun', days: 16 },
  { month: 'Jul', days: 14 },
]

const MOCK_SOURCE_BREAKDOWN: SourceBreakdown[] = [
  { source: 'LinkedIn Job Board', count: 219, percentage: 45.5 },
  { source: 'Direct Careers Portal', count: 106, percentage: 22.0 },
  { source: 'Employee Referral', count: 89, percentage: 18.5 },
  { source: 'GitHub / Tech Community', count: 43, percentage: 9.0 },
  { source: 'Recruitment Agency', count: 25, percentage: 5.0 },
]

const MOCK_DIVERSITY: DiversityMetrics[] = [
  { category: 'Gender Balance', value: 48, label: 'Female Representation' },
  { category: 'Global Talent', value: 35, label: 'Remote / International' },
  { category: 'Experience Mix', value: 65, label: 'Mid to Senior Engineers' },
]

export const analyticsService = {
  async getDashboardStats() {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard')
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback on API error
    }
    return MOCK_DASHBOARD_STATS
  },

  async getRecentActivity(limit = 10) {
    try {
      const response = await api.get<ApiResponse<Activity[]>>('/analytics/recent-activity', { params: { limit } })
      if (response.data?.data) {
        return response.data.data.map((item) => ({
          ...item,
          user: item.user || { name: item.userName || 'System', avatar: item.userAvatar },
        }))
      }
    } catch {
      // Fallback
    }
    return MOCK_RECENT_ACTIVITIES.slice(0, limit)
  },

  async getHiringFunnel(dateFrom?: string, dateTo?: string) {
    try {
      const response = await api.get<ApiResponse<HiringFunnel[]>>('/analytics/hiring-funnel', { params: { dateFrom, dateTo } })
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_HIRING_FUNNEL
  },

  async getTimeToHire(dateFrom?: string, dateTo?: string) {
    try {
      const response = await api.get<ApiResponse<TimeToHireData[]>>('/analytics/time-to-hire', { params: { dateFrom, dateTo } })
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_TIME_TO_HIRE
  },

  async getSourceBreakdown(dateFrom?: string, dateTo?: string) {
    try {
      const response = await api.get<ApiResponse<SourceBreakdown[]>>('/analytics/source-breakdown', { params: { dateFrom, dateTo } })
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_SOURCE_BREAKDOWN
  },

  async getDiversityMetrics() {
    try {
      const response = await api.get<ApiResponse<DiversityMetrics[]>>('/analytics/diversity')
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_DIVERSITY
  },

  async getJobAnalytics(jobId: string) {
    try {
      const response = await api.get<ApiResponse<{
        views: number
        applications: number
        interviews: number
        offers: number
        hires: number
        conversionRate: number
        averageTimeToHire: number
      }>>(`/analytics/jobs/${jobId}`)
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return {
      views: 1240,
      applications: 180,
      interviews: 28,
      offers: 6,
      hires: 4,
      conversionRate: 15.5,
      averageTimeToHire: 14,
    }
  },
}

