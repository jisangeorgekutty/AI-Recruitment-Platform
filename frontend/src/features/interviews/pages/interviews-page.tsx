import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { InterviewCard } from '@/features/interviews/components/interview-card'
import { interviewService } from '@/services/interview.service'

export default function InterviewsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewService.list({ pageSize: 50 }),
  })

  const interviews = data?.data ?? []
  const now = new Date()

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === 'upcoming') return i.status === 'scheduled' || i.status === 'confirmed'
    if (activeTab === 'completed') return i.status === 'completed'
    if (activeTab === 'cancelled') return i.status === 'cancelled'
    return true
  })

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Schedule and manage interviews"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        }
      />

      <Tabs
        tabs={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
          { value: 'all', label: 'All' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isLoading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="No interviews found"
          description="Schedule your first interview to get started"
        />
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onClick={() => navigate(`/interviews/${interview.id}`)}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
