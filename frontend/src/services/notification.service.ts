import api from './api'
import type { ApiResponse, Notification } from '@/types'

export const notificationService = {
  async list(page = 1, pageSize = 20) {
    const response = await api.get<ApiResponse<{ data: Notification[]; total: number; unreadCount: number }>>('/notifications', { params: { page, pageSize } })
    return response.data.data
  },

  async markAsRead(id: string) {
    const response = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`)
    return response.data.data
  },

  async markAllAsRead() {
    const response = await api.patch<ApiResponse<{ message: string }>>('/notifications/read-all')
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/notifications/${id}`)
    return response.data.data
  },

  async getUnreadCount() {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count')
    return response.data.data
  },
}
