import { create } from 'zustand'
import type { Notification } from '@/types'

export interface RecruiterNotificationPreferenceState {
  emailAlerts: boolean
  jobApplications: boolean
  candidateMessages: boolean
  weeklyReports: boolean
  marketingEmails: boolean
  securityAlerts: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  preferences: RecruiterNotificationPreferenceState | null
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  setUnreadCount: (count: number) => void
  setLoading: (isLoading: boolean) => void
  setPreferences: (preferences: RecruiterNotificationPreferenceState | null) => void
  updatePreferences: (data: Partial<RecruiterNotificationPreferenceState>) => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  preferences: null,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !(n.read || n.isRead))
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setLoading: (isLoading) => set({ isLoading }),

  setPreferences: (preferences) => set({ preferences }),

  updatePreferences: (data) =>
    set((state) => ({
      preferences: state.preferences ? { ...state.preferences, ...data } : (data as RecruiterNotificationPreferenceState),
    })),
}))
