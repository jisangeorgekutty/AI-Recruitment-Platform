import api from './api'
import type { ApiResponse, Job, PaginatedResponse, TableFilters } from '@/types'

export const jobService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', { params: filters })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`)
    return response.data.data
  },

  async create(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount' | 'viewsCount' | 'createdBy'>) {
    const response = await api.post<ApiResponse<Job>>('/jobs', data)
    return response.data.data
  },

  async update(id: string, data: Partial<Job>) {
    const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/jobs/${id}`)
    return response.data.data
  },

  async duplicate(id: string) {
    const response = await api.post<ApiResponse<Job>>(`/jobs/${id}/duplicate`)
    return response.data.data
  },

  async updateStatus(id: string, status: Job['status']) {
    const response = await api.patch<ApiResponse<Job>>(`/jobs/${id}/status`, { status })
    return response.data.data
  },

  async getStats() {
    const response = await api.get<ApiResponse<{
      total: number
      active: number
      draft: number
      closed: number
      byDepartment: { department: string; count: number }[]
    }>>('/jobs/stats')
    return response.data.data
  },
}
