import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThemeStore } from '@/store/theme-store'
import { useAuthStore } from '@/store/auth-store'
import { useNotificationStore } from '@/store/notification-store'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { recruiterSettingsService, type RecruiterNotificationPreference } from '@/services/recruiter-settings.service'
import { changePasswordSchema } from '@/features/auth/schemas'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'



export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')
  const { theme, setTheme } = useThemeStore()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const setStorePreferences = useNotificationStore((state) => state.setPreferences)

  // Profile Form State
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar)
  const nameParts = (user?.name || '').split(' ')
  const [firstName, setFirstName] = useState(nameParts[0] || '')
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Sync state if user changes in store
  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar)
      const parts = (user.name || '').split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setEmail(user.email || '')
    }
  }, [user])

  const fullName = `${firstName} ${lastName}`.trim() || user?.name || 'Recruiter User'

  // Profile Update Handler
  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      toast.error('First name is required')
      return
    }

    try {
      setIsUpdatingProfile(true)
      const updatedUser = await authService.updateProfile({
        name: fullName,
        avatar: avatarUrl,
      })
      if (updatedUser) {
        setUser(updatedUser)
      } else if (user) {
        setUser({
          ...user,
          name: fullName,
          avatar: avatarUrl,
        })
      }
      toast.success('Profile updated successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Notification Preferences Query & Mutation
  const { data: preferences, isLoading: isLoadingPrefs } = useQuery({
    queryKey: ['recruiter-notification-preferences'],
    queryFn: recruiterSettingsService.getNotificationPreferences,
  })

  const [notificationState, setNotificationState] = useState<RecruiterNotificationPreference>({
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    interviewReminders: true,
  })

  useEffect(() => {
    if (preferences) {
      setNotificationState(preferences)
      setStorePreferences(preferences as any)
    }
  }, [preferences, setStorePreferences])

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: RecruiterNotificationPreference) => recruiterSettingsService.updateNotificationPreferences(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['recruiter-notification-preferences'], data)
      setStorePreferences(data as any)
      toast.success('Notification preferences saved successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save notification preferences')
    },
  })

  const handleTogglePref = (key: keyof RecruiterNotificationPreference) => {
    setNotificationState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(notificationState)
  }

  // Security Form State & Handler
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)


  const handleChangePassword = async () => {
    const validationResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]
      toast.error(firstIssue.message)
      return
    }

    try {
      setIsChangingPassword(true)
      await authService.changePassword({ currentPassword, newPassword })
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to change password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account details, notification preferences, and security settings"
      />

      <Tabs
        tabs={[
          { value: 'profile', label: 'Profile' },
          { value: 'appearance', label: 'Appearance' },
          { value: 'notifications', label: 'Notifications' },
          { value: 'security', label: 'Security' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Profile Tab */}
      <TabPanel value="profile" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and profile picture stored in your user profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <AvatarUpload
                name={fullName}
                currentSrc={avatarUrl}
                size="xl"
                onImageChange={(uri) => setAvatarUrl(uri)}
              />
              <div>
                <h3 className="font-semibold text-lg">{fullName}</h3>
                <p className="text-xs text-muted-foreground">Click the camera icon to upload or change your profile picture</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
              <Input
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>

            <Input
              id="email"
              label="Email Address"
              value={email}
              disabled
              placeholder="john@company.com"
              type="email"
            />

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Appearance Tab */}
      <TabPanel value="appearance" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of your dashboard interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Theme</p>
              <div className="flex gap-3">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 rounded-xl border-2 p-4 text-center text-sm font-medium transition-all ${
                      theme === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="mb-2 text-lg">{t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}</div>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value="notifications" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Configure how and when you receive candidate updates and reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: 'emailNotifications' as const,
                label: 'Email Notifications',
                desc: 'Receive important recruiter updates via email',
              },
              {
                key: 'pushNotifications' as const,
                label: 'Push Notifications',
                desc: 'Receive real-time push notifications in your browser',
              },
              {
                key: 'applicationUpdates' as const,
                label: 'Application Updates',
                desc: 'Get notified immediately when candidates submit new applications',
              },
              {
                key: 'interviewReminders' as const,
                label: 'Interview Reminders',
                desc: 'Get automated reminders ahead of scheduled candidate interviews',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={!!notificationState[item.key]}
                    onChange={() => handleTogglePref(item.key)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}

            <Separator />
            <div className="flex justify-end">
              <Button
                onClick={handleSavePreferences}
                disabled={updatePreferencesMutation.isPending || isLoadingPrefs}
              >
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value="security" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Security & Password</CardTitle>
            <CardDescription>Change your account password to keep your recruiter profile secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                id="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                title={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Input
                  id="newPassword"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-emerald-500 font-medium' : ''}>
                  At least 8 characters long
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-emerald-500 font-medium' : ''}>
                  Contains at least one uppercase letter (A-Z)
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-emerald-500 font-medium' : ''}>
                  Contains at least one number (0-9)
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
