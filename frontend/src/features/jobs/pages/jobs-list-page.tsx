import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
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
import { useJobStore } from '@/store/job-store'
import type { Job } from '@/types'

export default function JobsListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({ search: '', status: '', type: '', department: '' })

  const { resetWizardDraft } = useJobStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.list({ ...filters, pageSize: 50 }),
  })

  // Mutations
  const duplicateMutation = useMutation({
    mutationFn: (id: number | string) => jobService.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-stats'] })
      toast.success('Job duplicated successfully!')
    },
    onError: () => toast.error('Failed to duplicate job'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) => jobService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-stats'] })
      toast.success(`Job status updated to ${variables.status}!`)
    },
    onError: () => toast.error('Failed to update job status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => jobService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-stats'] })
      toast.success('Job posting deleted!')
    },
    onError: () => toast.error('Failed to delete job'),
  })

  const jobs: Job[] = (data as any)?.items || (data as any)?.data || (Array.isArray(data) ? data : [])

  const filteredJobs = useMemo(() => {
    let result = jobs
    if (activeTab === 'published' || activeTab === 'active') {
      result = result.filter((j) => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'published')
    } else if (activeTab === 'draft') {
      result = result.filter((j) => j.status?.toLowerCase() === 'draft')
    } else if (activeTab === 'paused') {
      result = result.filter((j) => j.status?.toLowerCase() === 'paused')
    } else if (activeTab === 'closed') {
      result = result.filter((j) => j.status?.toLowerCase() === 'closed')
    }
    return result
  }, [jobs, activeTab])

  const tabCounts = {
    all: jobs.length,
    active: jobs.filter((j) => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'published').length,
    draft: jobs.filter((j) => j.status?.toLowerCase() === 'draft').length,
    paused: jobs.filter((j) => j.status?.toLowerCase() === 'paused').length,
    closed: jobs.filter((j) => j.status?.toLowerCase() === 'closed').length,
  }

  const tabs = [
    { value: 'all', label: 'All Jobs', count: tabCounts.all },
    { value: 'active', label: 'Active', count: tabCounts.active },
    { value: 'draft', label: 'Drafts', count: tabCounts.draft },
    { value: 'paused', label: 'Paused', count: tabCounts.paused },
    { value: 'closed', label: 'Closed', count: tabCounts.closed },
  ]

  const handleCreateNew = () => {
    resetWizardDraft()
    navigate('/recruiter/jobs/new')
  }

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Job Management"
        description="Create, monitor, and manage your job posting lifecycle and screening criteria."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job Wizard
          </Button>
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
          description={filters.search ? 'Try adjusting your search filters' : 'Create your first job posting using the Job Creation Wizard.'}
          action={filters.search ? undefined : { label: 'Create Job Opening', onClick: handleCreateNew }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDuplicate={(id) => duplicateMutation.mutate(id)}
              onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
