import api from './api'
import type { ApiResponse, DashboardStats, Activity } from '@/types'

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

export const analyticsService = {
  async getDashboardStats() {
    const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard')
    return response.data.data
  },

  async getRecentActivity(limit = 10) {
    const response = await api.get<ApiResponse<Activity[]>>('/analytics/recent-activity', { params: { limit } })
    return response.data.data
  },

  async getHiringFunnel(dateFrom?: string, dateTo?: string) {
    const response = await api.get<ApiResponse<HiringFunnel[]>>('/analytics/hiring-funnel', { params: { dateFrom, dateTo } })
    return response.data.data
  },

  async getTimeToHire(dateFrom?: string, dateTo?: string) {
    const response = await api.get<ApiResponse<TimeToHireData[]>>('/analytics/time-to-hire', { params: { dateFrom, dateTo } })
    return response.data.data
  },

  async getSourceBreakdown(dateFrom?: string, dateTo?: string) {
    const response = await api.get<ApiResponse<SourceBreakdown[]>>('/analytics/source-breakdown', { params: { dateFrom, dateTo } })
    return response.data.data
  },

  async getDiversityMetrics() {
    const response = await api.get<ApiResponse<DiversityMetrics[]>>('/analytics/diversity')
    return response.data.data
  },

  async getJobAnalytics(jobId: string) {
    const response = await api.get<ApiResponse<{
      views: number
      applications: number
      interviews: number
      offers: number
      hires: number
      conversionRate: number
      averageTimeToHire: number
    }>>(`/analytics/jobs/${jobId}`)
    return response.data.data
  },
}
