import api from './api'
import type { ApiResponse, Candidate, PaginatedResponse, TableFilters } from '@/types'

export const candidateService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number; jobId?: string }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Candidate>>>('/candidates', { params: filters })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`)
    return response.data.data
  },

  async create(data: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post<ApiResponse<Candidate>>('/candidates', data)
    return response.data.data
  },

  async update(id: string, data: Partial<Candidate>) {
    const response = await api.put<ApiResponse<Candidate>>(`/candidates/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidates/${id}`)
    return response.data.data
  },

  async updateStage(id: string, stage: Candidate['stage']) {
    const response = await api.patch<ApiResponse<Candidate>>(`/candidates/${id}/stage`, { stage })
    return response.data.data
  },

  async addNote(id: string, note: string) {
    const response = await api.post<ApiResponse<Candidate>>(`/candidates/${id}/notes`, { note })
    return response.data.data
  },

  async getPipeline(jobId?: string) {
    const response = await api.get<ApiResponse<Record<string, Candidate[]>>>('/candidates/pipeline', { params: { jobId } })
    return response.data.data
  },
}
