import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Calendar, Bot } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { InterviewCard } from '@/features/interviews/components/interview-card'
import { AIScorecardModal } from '@/features/interviews/components/ai-scorecard-modal'
import { CandidateScreeningRoom } from '@/features/interviews/components/candidate-screening-room'
import { ScheduleInterviewModal } from '@/features/interviews/components/schedule-interview-modal'
import { interviewService } from '@/services/interview.service'
import { useInterviewStore } from '@/store/interview-store'

export default function InterviewsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const { setActiveScreeningInterview } = useInterviewStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewService.list({ pageSize: 50 }),
  })

  const interviews = Array.isArray(data) ? data : (data?.data ?? data?.items ?? [])

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === 'upcoming') return i.status === 'scheduled' || i.status === 'confirmed'
    if (activeTab === 'completed') return i.status === 'completed'
    if (activeTab === 'cancelled') return i.status === 'cancelled'
    return true
  })

  if (error && interviews.length === 0) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Interviews & AI Screening"
        description="Schedule, conduct AI screening, and review candidate scorecards"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              onClick={() => {
                const sampleScreening = interviews[0] || {
                  id: 'int-demo',
                  title: 'AI Technical Screening - Senior Engineer',
                  jobTitle: 'Senior Full Stack Engineer',
                  candidateName: 'Sarah Chen',
                }
                setActiveScreeningInterview(sampleScreening as any)
              }}
            >
              <Bot className="mr-2 h-4 w-4 text-purple-400" />
              Launch Demo AI Screening
            </Button>
            <Button onClick={() => setIsScheduleModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
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

      {/* Modals */}
      <ScheduleInterviewModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      <CandidateScreeningRoom />
      <AIScorecardModal />
    </motion.div>
  )
}
