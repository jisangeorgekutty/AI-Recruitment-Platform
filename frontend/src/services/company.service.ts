import api from './api'
import type { ApiResponse, Company, User } from '@/types'

export const companyService = {
  async getProfile() {
    const response = await api.get<ApiResponse<Company>>('/company/profile')
    return response.data.data
  },

  async updateProfile(data: Partial<Company>) {
    const response = await api.put<ApiResponse<Company>>('/company/profile', data)
    return response.data.data
  },

  async getTeamMembers() {
    const response = await api.get<ApiResponse<User[]>>('/company/team')
    return response.data.data
  },

  async inviteMember(email: string, role: User['role']) {
    const response = await api.post<ApiResponse<{ message: string }>>('/company/invite', { email, role })
    return response.data.data
  },

  async removeMember(userId: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/company/team/${userId}`)
    return response.data.data
  },

  async updateMemberRole(userId: string, role: User['role']) {
    const response = await api.put<ApiResponse<User>>(`/company/team/${userId}/role`, { role })
    return response.data.data
  },
}
