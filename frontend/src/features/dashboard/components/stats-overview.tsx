import { Briefcase, Users, Calendar, CheckCircle2 } from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { type DashboardStats } from '@/types'

interface StatsOverviewProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon={<Briefcase className="h-6 w-6" />}
        trend={{ value: 12, positive: true }}
        description="vs last month"
      />
      <StatCard
        title="Total Candidates"
        value={stats.totalCandidates}
        icon={<Users className="h-6 w-6" />}
        trend={{ value: 8, positive: true }}
        description="vs last month"
      />
      <StatCard
        title="Interviews This Week"
        value={stats.interviewsThisWeek}
        icon={<Calendar className="h-6 w-6" />}
        trend={{ value: 3, positive: false }}
        description="vs last week"
      />
      <StatCard
        title="Candidates Hired"
        value={stats.candidatesHired}
        icon={<CheckCircle2 className="h-6 w-6" />}
        trend={{ value: 24, positive: true }}
        description="this quarter"
      />
    </div>
  )
}
