import type { Job, TableFilters } from '@/types'

export type { Job, TableFilters }

export interface JobFormData {
  title: string
  department: string
  location: string
  type: Job['type']
  experienceLevel: Job['experienceLevel']
  description: string
  requirements: string[]
  responsibilities: string[]
  salaryMin?: number
  salaryMax?: number
  currency: string
  hiringManager?: string
}
