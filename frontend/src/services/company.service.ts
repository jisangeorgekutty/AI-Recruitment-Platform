import api from './api'
import type { ApiResponse, Company } from '@/types'

export const companyService = {
  async getProfile() {
    const response = await api.get<ApiResponse<Company>>('/company')
    return response.data.data
  },

  async updateProfile(data: Partial<Company>) {
    const response = await api.put<ApiResponse<Company>>('/company', data)
    return response.data.data
  },

  async uploadLogo(file: File) {
    const formData = new FormData()
    formData.append('logoFile', file)
    const response = await api.post<ApiResponse<string>>('/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },
}
