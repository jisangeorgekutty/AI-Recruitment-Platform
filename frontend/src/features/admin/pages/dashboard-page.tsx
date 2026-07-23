import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { BarChart3, Users, Building2, Briefcase, CreditCard, TrendingUp, DollarSign } from 'lucide-react'

const stats = [
  { label: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { label: 'Active Jobs', value: '1,429', change: '+8.2%', icon: Briefcase, color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Companies', value: '843', change: '+5.7%', icon: Building2, color: 'text-violet-600 bg-violet-100' },
  { label: 'Revenue (MTD)', value: '$48,290', change: '+18.3%', icon: DollarSign, color: 'text-amber-600 bg-amber-100' },
]

const recentUsers = [
  { name: 'Sarah Chen', email: 'sarah@google.com', role: 'recruiter', plan: 'Enterprise', date: '2 min ago' },
  { name: 'Alex Kim', email: 'alex@stripe.com', role: 'candidate', plan: 'Free', date: '15 min ago' },
  { name: 'Maria Lopez', email: 'maria@meta.com', role: 'recruiter', plan: 'Professional', date: '1 hour ago' },
  { name: 'James Wilson', email: 'james@apple.com', role: 'candidate', plan: 'Free', date: '3 hours ago' },
]

export default function AdminDashboardPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and analytics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <div className={`rounded-lg p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{s.change} vs last month</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" /><p className="text-sm">Revenue chart will render here</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="capitalize">{u.role} - {u.plan}</p>
                  <p>{u.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
