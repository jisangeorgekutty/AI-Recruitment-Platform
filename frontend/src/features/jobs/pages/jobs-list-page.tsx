import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { JobCard } from '@/features/jobs/components/job-card'
import { JobFilters } from '@/features/jobs/components/job-filters'
import { jobService } from '@/services/job.service'
import type { Job } from '@/types'

export default function JobsListPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({ search: '', status: '', type: '', department: '' })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.list({ ...filters, pageSize: 50 }),
  })

  const jobs = data?.data ?? []

  const filteredJobs = useMemo(() => {
    let result = jobs
    if (activeTab === 'published') result = result.filter((j) => j.status === 'published')
    if (activeTab === 'draft') result = result.filter((j) => j.status === 'draft')
    if (activeTab === 'closed') result = result.filter((j) => j.status === 'closed')
    return result
  }, [jobs, activeTab])

  const tabCounts = {
    all: jobs.length,
    published: jobs.filter((j) => j.status === 'published').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
  }

  const tabs = [
    { value: 'all', label: 'All Jobs', count: tabCounts.all },
    { value: 'published', label: 'Published', count: tabCounts.published },
    { value: 'draft', label: 'Draft', count: tabCounts.draft },
    { value: 'closed', label: 'Closed', count: tabCounts.closed },
  ]

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Manage your job postings"
        actions={
          <Link to="/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <JobFilters
          filters={filters}
          onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onReset={() => setFilters({ search: '', status: '', type: '', department: '' })}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="list" count={6} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-12 w-12" />}
          title="No jobs found"
          description={filters.search ? 'Try adjusting your search' : 'Create your first job posting to get started'}
          action={filters.search ? undefined : { label: 'Create Job', onClick: () => navigate('/jobs/new') }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
