import { analyticsService, type HiringFunnel, type TimeToHireData, type SourceBreakdown } from '@/services/analytics.service'

export const dashboardService = {
  getStats: analyticsService.getDashboardStats,
  getRecentActivity: analyticsService.getRecentActivity,
  getHiringFunnel: analyticsService.getHiringFunnel,
  getTimeToHire: analyticsService.getTimeToHire,
  getSourceBreakdown: analyticsService.getSourceBreakdown,
}

export type { HiringFunnel, TimeToHireData, SourceBreakdown }
