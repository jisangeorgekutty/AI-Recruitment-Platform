import { X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { STAGE_LABELS } from '../types'
import { useJobMatchStore } from '@/store/job-match-store'

interface CandidateFiltersProps {
  filters: {
    search: string
    stage: string
    status: string
  }
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export function CandidateFilters({ filters, onFilterChange, onReset }: CandidateFiltersProps) {
  const { sortByAiScore, toggleSortByAiScore } = useJobMatchStore()
  const hasFilters = filters.search || filters.stage || filters.status || sortByAiScore

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search candidates..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="w-48"
      />
      <Select
        value={filters.stage}
        onChange={(e) => onFilterChange('stage', e.target.value)}
        options={[
          { value: '', label: 'All Stages' },
          ...Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label })),
        ]}
        className="w-36"
      />
      <Select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        options={[
          { value: '', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'passive', label: 'Passive' },
          { value: 'placed', label: 'Placed' },
          { value: 'archived', label: 'Archived' },
        ]}
        className="w-36"
      />
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
        {sortByAiScore ? 'AI Score: High to Low' : 'Sort by AI Match'}
      </Button>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  )
}

