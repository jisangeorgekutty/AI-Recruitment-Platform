import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { CandidateCard } from '@/features/applicants/components/candidate-card'
import { CandidateFilters } from '@/features/applicants/components/candidate-filters'
import { candidateService } from '@/services/candidate.service'
import { Users, List, Columns, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { CandidateMatchModal } from '@/features/applicants/components/candidate-match-modal'
import { useJobMatchStore } from '@/store/job-match-store'

export default function CandidatesListPage() {
  const navigate = useNavigate()
  const { sortByAiScore, toggleSortByAiScore } = useJobMatchStore()
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [filters, setFilters] = useState({ search: '', stage: '', status: '' })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => candidateService.list({ ...filters, pageSize: 50 }),
  })

  const candidates = data?.items ?? data?.data ?? []

  const filteredCandidates = useMemo(() => {
    let result = candidates
    if (activeTab === 'active') result = candidates.filter((c) => c.status === 'active')
    else if (activeTab === 'hired') result = candidates.filter((c) => c.stage === 'hired')
    else if (activeTab === 'rejected') result = candidates.filter((c) => c.stage === 'rejected')

    if (sortByAiScore) {
      return [...result].sort((a, b) => (b.resumeScore ?? 0) - (a.resumeScore ?? 0))
    }
    return result
  }, [candidates, activeTab, sortByAiScore])

  const tabCounts = {
    all: candidates.length,
    active: candidates.filter((c) => c.status === 'active').length,
    hired: candidates.filter((c) => c.stage === 'hired').length,
    rejected: candidates.filter((c) => c.stage === 'rejected').length,
  }

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage your candidate pipeline"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={sortByAiScore ? 'default' : 'outline'}
              size="sm"
              onClick={toggleSortByAiScore}
              className={
                sortByAiScore
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5'
                  : 'text-indigo-600 border-indigo-500/30 dark:text-indigo-400 gap-1.5 hover:bg-indigo-500/10'
              }
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              {sortByAiScore ? 'Sorted by AI Match' : 'Sort by AI Match Score'}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate('/recruiter/candidates/pipeline')}
            >
              <Columns className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { value: 'all', label: 'All Candidates', count: tabCounts.all },
            { value: 'active', label: 'Active', count: tabCounts.active },
            { value: 'hired', label: 'Hired', count: tabCounts.hired },
            { value: 'rejected', label: 'Rejected', count: tabCounts.rejected },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <CandidateFilters
          filters={filters}
          onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onReset={() => setFilters({ search: '', stage: '', status: '' })}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="list" count={6} />
      ) : filteredCandidates.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No candidates found"
          description={filters.search ? 'Try adjusting your search' : 'No candidates have applied yet'}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}

      <CandidateMatchModal />
    </motion.div>
  )
}
