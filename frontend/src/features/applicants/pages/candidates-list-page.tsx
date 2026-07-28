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
import { Users, List, Columns, Sparkles, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { CandidateMatchModal } from '@/features/applicants/components/candidate-match-modal'
import { useJobMatchStore } from '@/store/job-match-store'
import { useCandidateStore } from '@/store/candidate-store'

export default function CandidatesListPage() {
  const navigate = useNavigate()
  const { sortByAiScore, toggleSortByAiScore } = useJobMatchStore()
  const { comparisonCandidates, clearComparison } = useCandidateStore()

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
      return [...result].sort(
        (a, b) => (b.matchScoreOverall ?? b.resumeScore ?? 0) - (a.matchScoreOverall ?? a.resumeScore ?? 0)
      )
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
        description="Manage your candidate pipeline and rank applicants by AI fit"
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
          {filteredCandidates.map((candidate, idx) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              rank={sortByAiScore ? idx + 1 : undefined}
            />
          ))}
        </div>
      )}

      {/* Floating Comparison Action Bar */}
      {comparisonCandidates.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl border"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4" />
            <span>{comparisonCandidates.length} Selected for Comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full font-bold gap-1 text-xs"
              onClick={() => navigate('/recruiter/candidates/compare')}
            >
              Compare Side-by-Side
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={clearComparison}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <CandidateMatchModal />
    </motion.div>
  )
}
