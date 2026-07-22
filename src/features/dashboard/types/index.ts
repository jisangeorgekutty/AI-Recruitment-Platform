import type { DashboardStats, Activity } from '@/types'

export interface ChartDataPoint {
  name: string
  value: number
}

export interface HiringStage {
  stage: string
  count: number
  color: string
}

export { type DashboardStats, type Activity }
