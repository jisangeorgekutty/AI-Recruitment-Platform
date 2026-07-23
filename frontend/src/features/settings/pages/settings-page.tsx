import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThemeStore } from '@/store/theme-store'
import { useAuthStore } from '@/store/auth-store'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { theme, setTheme } = useThemeStore()
  const user = useAuthStore((state) => state.user)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
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

      <TabPanel value="profile" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="name" label="Full Name" defaultValue={user?.name || ''} placeholder="John Doe" />
              <Input id="email" label="Email" defaultValue={user?.email || ''} placeholder="john@company.com" type="email" />
            </div>
            <Input id="avatar" label="Avatar URL" defaultValue={user?.avatar || ''} placeholder="https://..." />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Profile updated')}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="appearance" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
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

      <TabPanel value="notifications" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive notifications via email' },
              { label: 'Push Notifications', desc: 'Receive push notifications in browser' },
              { label: 'Application Updates', desc: 'Get notified when candidates apply' },
              { label: 'Interview Reminders', desc: 'Get reminded about upcoming interviews' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="security" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="currentPassword" label="Current Password" type="password" placeholder="••••••••" />
              <Input id="newPassword" label="New Password" type="password" placeholder="At least 8 characters" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Security settings updated')}>Update Security</Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
