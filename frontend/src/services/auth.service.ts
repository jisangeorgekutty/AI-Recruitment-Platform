import api from './api'
import type { ApiResponse, User } from '@/types'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  companyName: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Silently handle server-side logout failure
    }
  },

  async getProfile() {
    const response = await api.get<ApiResponse<User>>('/auth/profile')
    return response.data.data
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data)
    return response.data.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put<ApiResponse<{ message: string }>>('/auth/change-password', data)
    return response.data.data
  },

  async forgotPassword(email: string) {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email })
    return response.data.data
  },

  async resetPassword(data: { token: string; password: string }) {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)
    return response.data.data
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken })
    return response.data.data
  },
}
