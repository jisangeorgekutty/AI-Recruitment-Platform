import api from './api'
import type { ApiResponse, Job, PaginatedResponse, TableFilters } from '@/types'

export interface CreateJobPayload {
  title: string
  department: string
  location: string
  remoteType?: string
  employmentType?: string
  experienceLevel?: string
  description: string
  requirements?: string
  responsibilities?: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  showSalary?: boolean
  hiringManager?: string
  status?: string
  skills?: any[]
  screeningQuestions?: any[]
}

export const jobService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', { params: filters })
    return response.data.data
  },

  async getById(id: number | string) {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`)
    return response.data.data
  },

  async create(data: CreateJobPayload) {
    const response = await api.post<ApiResponse<Job>>('/jobs', data)
    return response.data.data
  },

  async update(id: number | string, data: Partial<CreateJobPayload>) {
    const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data)
    return response.data.data
  },

  async delete(id: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/jobs/${id}`)
    return response.data.data
  },

  async duplicate(id: number | string) {
    const response = await api.post<ApiResponse<Job>>(`/jobs/${id}/duplicate`)
    return response.data.data
  },

  async updateStatus(id: number | string, status: string) {
    const response = await api.patch<ApiResponse<Job>>(`/jobs/${id}/status`, { status })
    return response.data.data
  },

  async getStats() {
    const response = await api.get<ApiResponse<{
      total: number
      active: number
      draft: number
      paused: number
      closed: number
      byDepartment: { department: string; count: number }[]
    }>>('/jobs/stats')
    return response.data.data
  },
}
