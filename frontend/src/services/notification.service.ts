import api from './api'
import type { ApiResponse, Notification } from '@/types'

export const notificationService = {
  async list(page = 1, pageSize = 20) {
    const response = await api.get<ApiResponse<{ data: any[]; total: number; unreadCount: number }>>('/notifications', { params: { page, pageSize } })
    const resData = response.data.data
    if (resData && Array.isArray(resData.data)) {
      const normalizedData: Notification[] = resData.data.map((n: any) => {
        const readBool = Boolean(n.isRead ?? n.read)
        return {
          id: String(n.id),
          type: n.type || 'system',
          title: n.title || '',
          message: n.message || '',
          read: readBool,
          isRead: readBool,
          link: n.linkUrl || n.link || '',
          linkUrl: n.linkUrl || n.link || '',
          createdAt: n.createdOn || n.createdAt || new Date().toISOString(),
          createdOn: n.createdOn || n.createdAt || new Date().toISOString(),
        }
      })
      return {
        data: normalizedData,
        total: resData.total ?? normalizedData.length,
        unreadCount: resData.unreadCount ?? normalizedData.filter(n => !n.read).length,
      }
    }
    return resData
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
