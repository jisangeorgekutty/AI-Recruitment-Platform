import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { useThemeStore } from '@/store/theme-store'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CandidateSettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const { theme, setTheme } = useThemeStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Settings" description="Manage your account preferences" />
      <Tabs tabs={[{ value: 'account', label: 'Account' }, { value: 'appearance', label: 'Appearance' }, { value: 'notifications', label: 'Notifications' }, { value: 'privacy', label: 'Privacy' }]} activeTab={activeTab} onTabChange={setActiveTab} />

      <TabPanel value="account" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Account Settings</CardTitle><CardDescription>Update your email and password</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Input id="email" label="Email" defaultValue="john.doe@email.com" type="email" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="newPassword" label="New Password" type="password" placeholder="Leave blank to keep current" />
              <Input id="confirmPassword" label="Confirm Password" type="password" />
            </div>
            <div className="flex justify-end"><Button onClick={() => toast.success('Account updated')}>Save Changes</Button></div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="appearance" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">Theme</p>
            <div className="flex gap-3">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)} className={`flex-1 rounded-xl border-2 p-4 text-center text-sm font-medium transition-all ${theme === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <div className="mb-2 text-lg">{t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}</div>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="notifications" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive application updates via email' },
              { label: 'Push Notifications', desc: 'Receive browser notifications' },
              { label: 'Interview Reminders', desc: 'Get reminded before interviews' },
              { label: 'Marketing Emails', desc: 'Receive job recommendations and tips' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
            <Separator />
            <div className="flex justify-end"><Button onClick={() => toast.success('Preferences saved')}>Save</Button></div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="privacy" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Profile Visibility</p><p className="text-xs text-muted-foreground">Let recruiters find you</p></div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Show Resume in Search</p><p className="text-xs text-muted-foreground">Allow recruiters to find your resume</p></div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
