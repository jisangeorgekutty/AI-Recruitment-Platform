import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { ErrorState } from '@/components/error-state'
import { HiringFunnelChart } from '@/features/analytics/components/hiring-funnel'
import { TimeToHireChart } from '@/features/analytics/components/time-to-hire-chart'
import { SourceBreakdownChart } from '@/features/analytics/components/source-breakdown'
import { analyticsService } from '@/services/analytics.service'
import { Briefcase, Users, Clock, TrendingUp } from 'lucide-react'

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: analyticsService.getDashboardStats,
  })

  const { data: funnel, isLoading: funnelLoading } = useQuery({
    queryKey: ['hiring-funnel'],
    queryFn: () => analyticsService.getHiringFunnel(),
  })

  const { data: timeToHire, isLoading: timeLoading } = useQuery({
    queryKey: ['time-to-hire'],
    queryFn: () => analyticsService.getTimeToHire(),
  })

  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['source-breakdown'],
    queryFn: () => analyticsService.getSourceBreakdown(),
  })

  if (statsError) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep insights into your recruitment metrics"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={stats?.applicationsThisMonth ?? 0}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 18, positive: true }}
          isLoading={statsLoading}
        />
        <StatCard
          title="Offers Sent"
          value={stats?.offersSent ?? 0}
          icon={<Briefcase className="h-6 w-6" />}
          trend={{ value: 7, positive: true }}
          isLoading={statsLoading}
        />
        <StatCard
          title="Avg. Time to Hire"
          value={`${stats?.timeToHire ?? 0}d`}
          icon={<Clock className="h-6 w-6" />}
          trend={{ value: 12, positive: false }}
          isLoading={statsLoading}
        />
        <StatCard
          title="Acceptance Rate"
          value={`${stats?.acceptanceRate ?? 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 5, positive: true }}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HiringFunnelChart data={funnel ?? []} isLoading={funnelLoading} />
        <TimeToHireChart data={timeToHire ?? []} isLoading={timeLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SourceBreakdownChart data={sources ?? []} isLoading={sourcesLoading} />
      </div>
    </motion.div>
  )
}
