import api from './api'
import type { ApiResponse, Interview, PaginatedResponse, TableFilters } from '@/types'

export const interviewService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number; candidateId?: string; jobId?: string }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Interview>>>('/interviews', { params: filters })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Interview>>(`/interviews/${id}`)
    return response.data.data
  },

  async create(data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt' | 'interviewers' | 'feedback'>) {
    const response = await api.post<ApiResponse<Interview>>('/interviews', data)
    return response.data.data
  },

  async update(id: string, data: Partial<Interview>) {
    const response = await api.put<ApiResponse<Interview>>(`/interviews/${id}`, data)
    return response.data.data
  },

  async cancel(id: string) {
    const response = await api.patch<ApiResponse<Interview>>(`/interviews/${id}/cancel`)
    return response.data.data
  },

  async submitFeedback(id: string, feedback: Interview['feedback']) {
    const response = await api.post<ApiResponse<Interview>>(`/interviews/${id}/feedback`, feedback)
    return response.data.data
  },

  async getUpcoming() {
    const response = await api.get<ApiResponse<Interview[]>>('/interviews/upcoming')
    return response.data.data
  },

  async getCalendar(dateFrom: string, dateTo: string) {
    const response = await api.get<ApiResponse<Interview[]>>('/interviews/calendar', { params: { dateFrom, dateTo } })
    return response.data.data
  },
}
