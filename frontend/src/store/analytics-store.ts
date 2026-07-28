import { create } from 'zustand'
import type { DashboardStats, Activity } from '@/types'
import type { HiringFunnel, TimeToHireData, SourceBreakdown, DiversityMetrics } from '@/services/analytics.service'

interface AnalyticsState {
  stats: DashboardStats | null
  funnel: HiringFunnel[]
  timeToHire: TimeToHireData[]
  sources: SourceBreakdown[]
  diversity: DiversityMetrics[]
  recentActivities: Activity[]
  isLoading: boolean
  setStats: (stats: DashboardStats | null) => void
  setFunnel: (funnel: HiringFunnel[]) => void
  setTimeToHire: (timeToHire: TimeToHireData[]) => void
  setSources: (sources: SourceBreakdown[]) => void
  setDiversity: (diversity: DiversityMetrics[]) => void
  setRecentActivities: (activities: Activity[]) => void
  setLoading: (isLoading: boolean) => void
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  stats: null,
  funnel: [],
  timeToHire: [],
  sources: [],
  diversity: [],
  recentActivities: [],
  isLoading: false,

  setStats: (stats) => set({ stats }),
  setFunnel: (funnel) => set({ funnel }),
  setTimeToHire: (timeToHire) => set({ timeToHire }),
  setSources: (sources) => set({ sources }),
  setDiversity: (diversity) => set({ diversity }),
  setRecentActivities: (recentActivities) => set({ recentActivities }),
  setLoading: (isLoading) => set({ isLoading }),
}))
