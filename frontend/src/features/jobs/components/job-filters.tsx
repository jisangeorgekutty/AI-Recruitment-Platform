import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Job } from '@/types'

interface JobFiltersProps {
  filters: {
    search: string
    status: string
    type: string
    department: string
  }
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export function JobFilters({ filters, onFilterChange, onReset }: JobFiltersProps) {
  const hasFilters = filters.search || filters.status || filters.type || filters.department

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search jobs..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="w-48"
      />
      <Select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        options={[
          { value: '', label: 'All Status' },
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'closed', label: 'Closed' },
          { value: 'archived', label: 'Archived' },
        ]}
        className="w-36"
        placeholder="All Status"
      />
      <Select
        value={filters.type}
        onChange={(e) => onFilterChange('type', e.target.value)}
        options={[
          { value: '', label: 'All Types' },
          { value: 'full-time', label: 'Full Time' },
          { value: 'part-time', label: 'Part Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'remote', label: 'Remote' },
        ]}
        className="w-36"
        placeholder="All Types"
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
