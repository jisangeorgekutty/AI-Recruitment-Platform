import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { BarChart3, Users, Building2, Briefcase, TrendingUp, DollarSign } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

export default function AdminDashboardPage() {
  const { dashboardStats, setDashboardStats } = useAdminStore()

  const { data: fetchedStats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminService.getDashboardStats,
  })

  useEffect(() => {
    if (fetchedStats) {
      setDashboardStats(fetchedStats)
    }
  }, [fetchedStats, setDashboardStats])

  const statsData = dashboardStats ?? fetchedStats

  const statCards = [
    { label: 'Total Users', value: statsData?.totalUsers ?? 0, change: 'Real-time', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Active Jobs', value: statsData?.totalActiveJobs ?? 0, change: 'Active', icon: Briefcase, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Companies', value: statsData?.totalCompanies ?? 0, change: 'Registered', icon: Building2, color: 'text-violet-600 bg-violet-100' },
    { label: 'Revenue (MTD)', value: `$${(statsData?.totalMonthlyRevenue ?? 0).toLocaleString()}`, change: 'Current Month', icon: DollarSign, color: 'text-amber-600 bg-amber-100' },
  ]

  const recentUsersList = statsData?.recentUsers ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and analytics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                <div className={`rounded-lg p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
              </div>
              <p className="text-2xl font-bold">{isLoading ? '...' : s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-600" />{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Platform Metrics Overview</CardTitle></CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Real-time metrics active ({statsData?.totalApplications ?? 0} applications processed)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Platform Users</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {recentUsersList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent registered users</p>
            ) : (
              recentUsersList.map((u) => (
                <div key={u.email} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="capitalize">{u.role} - {u.plan}</p>
                    <p>{u.date}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
