import api from './api'
import type { ApiResponse, Job } from '@/types'

export interface CandidateSavedJob {
  id: number
  jobPostingId: number
  jobPosting: Job
  savedAt: string
}

export const savedJobService = {
  async getMySavedJobs() {
    const response = await api.get<ApiResponse<CandidateSavedJob[]>>('/saved-jobs')
    return response.data.data
  },

  async saveJob(jobId: number | string) {
    const response = await api.post<ApiResponse<boolean>>(`/saved-jobs/${jobId}`)
    return response.data.data
  },

  async removeSavedJob(jobId: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/saved-jobs/${jobId}`)
    return response.data.data
  },
}
