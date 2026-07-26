import api from './api'
import type { ApiResponse } from '@/types'

export interface RecruiterNotificationPreference {
  id?: number
  userId?: number
  emailNotifications: boolean
  pushNotifications: boolean
  applicationUpdates: boolean
  interviewReminders: boolean
}

export const recruiterSettingsService = {
  async getNotificationPreferences() {
    const response = await api.get<ApiResponse<RecruiterNotificationPreference>>('/recruiter/settings/notifications')
    return response.data.data
  },

  async updateNotificationPreferences(data: RecruiterNotificationPreference) {
    const response = await api.put<ApiResponse<RecruiterNotificationPreference>>('/recruiter/settings/notifications', data)
    return response.data.data
  },
}
