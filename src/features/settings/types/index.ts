export interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  applicationUpdates: boolean
  interviewReminders: boolean
  marketingEmails: boolean
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  lastPasswordChange: string
  activeSessions: { id: string; device: string; location: string; lastActive: string }[]
}
