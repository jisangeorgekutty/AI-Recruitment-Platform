import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { CandidateCard } from '@/features/candidates/components/candidate-card'
import { CandidateFilters } from '@/features/candidates/components/candidate-filters'
import { candidateService } from '@/services/candidate.service'
import { Users, List, Columns } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CandidatesListPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [filters, setFilters] = useState({ search: '', stage: '', status: '' })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => candidateService.list({ ...filters, pageSize: 50 }),
  })

  const candidates = data?.data ?? []

  const filteredCandidates = useMemo(() => {
    if (activeTab === 'active') return candidates.filter((c) => c.status === 'active')
    if (activeTab === 'hired') return candidates.filter((c) => c.stage === 'hired')
    if (activeTab === 'rejected') return candidates.filter((c) => c.stage === 'rejected')
    return candidates
  }, [candidates, activeTab])

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
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate('/candidates/pipeline')}
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
    </motion.div>
  )
}
