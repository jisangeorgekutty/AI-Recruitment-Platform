import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { StatsOverview } from '@/features/dashboard/components/stats-overview'
import { RecentActivity } from '@/features/dashboard/components/recent-activity'
import { JobStatusChart } from '@/features/dashboard/components/job-status-chart'
import { HiringPipeline } from '@/features/dashboard/components/hiring-pipeline'
import { UpcomingInterviews } from '@/features/dashboard/components/upcoming-interviews'
import { TopCandidates } from '@/features/dashboard/components/top-candidates'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'
import { interviewService } from '@/services/interview.service'
import { candidateService } from '@/services/candidate.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorState } from '@/components/error-state'

const jobStatusData = [
  { name: 'Active', value: 24, color: '#818cf8' },
  { name: 'Draft', value: 8, color: '#fbbf24' },
  { name: 'Closed', value: 6, color: '#fb7185' },
  { name: 'Archived', value: 3, color: '#94a3b8' },
]

const pipelineStages = [
  { stage: 'Sourced', count: 120, color: '#818cf8' },
  { stage: 'Applied', count: 85, color: '#a78bfa' },
  { stage: 'Screened', count: 52, color: '#c084fc' },
  { stage: 'Interview', count: 28, color: '#e879f9' },
  { stage: 'Technical', count: 18, color: '#f472b6' },
  { stage: 'Offer', count: 8, color: '#34d399' },
  { stage: 'Hired', count: 5, color: '#22d3ee' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => dashboardService.getRecentActivity(10),
  })

  const { data: interviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ['upcoming-interviews'],
    queryFn: interviewService.getUpcoming,
  })

  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['top-candidates'],
    queryFn: () => candidateService.list({ pageSize: 5, sortBy: 'rating', sortOrder: 'desc' }),
  })

  if (statsError && !stats) {
    return <ErrorState onRetry={refetchStats} />
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your recruitment activities"
      />

      <StatsOverview stats={stats ?? null} isLoading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="space-y-6 lg:col-span-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <JobStatusChart data={jobStatusData} isLoading={statsLoading} />
            <HiringPipeline stages={pipelineStages} isLoading={statsLoading} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={activities ?? []} isLoading={activitiesLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <UpcomingInterviews
            interviews={interviews ?? []}
            isLoading={interviewsLoading}
          />
          <TopCandidates
            candidates={candidates?.data ?? []}
            isLoading={candidatesLoading}
          />
        </div>
      </div>
    </motion.div>
  )
}
