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

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { theme, setTheme } = useThemeStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Settings" description="Platform configuration" />
      <Tabs tabs={[{ value: 'general', label: 'General' }, { value: 'appearance', label: 'Appearance' }, { value: 'security', label: 'Security' }, { value: 'integrations', label: 'Integrations' }]} activeTab={activeTab} onTabChange={setActiveTab} />

      <TabPanel value="general" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Platform-wide configuration</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Input id="platformName" label="Platform Name" defaultValue="HireGen AI" />
            <Input id="supportEmail" label="Support Email" defaultValue="support@hiregen.ai" type="email" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="maxUsers" label="Max Users Per Plan (Free)" defaultValue="10" type="number" />
              <Input id="trialDays" label="Trial Period (Days)" defaultValue="14" type="number" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Maintenance Mode</p><p className="text-xs text-muted-foreground">Block all user access except admins</p></div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </label>
            </div>
            <div className="flex justify-end"><Button onClick={() => toast.success('Settings saved')}>Save Changes</Button></div>
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

      <TabPanel value="security" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p></div>
              <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" className="peer sr-only" /><div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" /></label>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Session Timeout</p><p className="text-xs text-muted-foreground">Auto-logout after inactivity (minutes)</p></div>
              <Input className="w-20" defaultValue="60" type="number" />
            </div>
            <div className="flex justify-end"><Button onClick={() => toast.success('Security settings updated')}>Save</Button></div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="integrations" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'OpenAI', desc: 'AI resume parsing and matching', connected: true },
              { name: 'Stripe', desc: 'Payment processing', connected: true },
              { name: 'SendGrid', desc: 'Email notifications', connected: false },
              { name: 'Google Calendar', desc: 'Interview scheduling', connected: false },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.desc}</p></div>
                <Button size="sm" variant={i.connected ? 'outline' : 'default'} onClick={() => toast.success(`${i.name} ${i.connected ? 'disconnected' : 'connected'}`)}>{i.connected ? 'Disconnect' : 'Connect'}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
