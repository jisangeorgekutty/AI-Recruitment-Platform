import api from './api'
import type { ApiResponse, Job, PaginatedResponse } from '@/types'

export interface JobFilterParams {
  search?: string
  status?: string
  department?: string
  remoteType?: string
  employmentType?: string
  experienceLevel?: string
  companyProfileId?: number
  page?: number
  pageSize?: number
}

export const jobSearchService = {
  async searchJobs(params?: JobFilterParams) {
    const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobsearch', { params })
    return response.data.data
  },

  async getJobDetails(id: number | string) {
    const response = await api.get<ApiResponse<Job>>(`/jobsearch/${id}`)
    return response.data.data
  },
}
