import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { CandidateScreeningRoom } from '@/features/interviews/components/candidate-screening-room'
import { useInterviewStore } from '@/store/interview-store'
import { interviewService } from '@/services/interview.service'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Video, Bot, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function CandidateInterviewsPage() {
  const { setActiveScreeningInterview } = useInterviewStore()

  const { data: upcomingInterviews = [], isLoading } = useQuery({
    queryKey: ['candidate-interviews'],
    queryFn: () => interviewService.getUpcoming(),
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Upcoming & AI Screening Interviews" description="Join live interviews or take automated AI screening sessions" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
          <p className="text-sm">Loading your scheduled interviews...</p>
        </div>
      ) : upcomingInterviews.length === 0 ? (
        <EmptyState icon={<Calendar className="h-12 w-12 text-slate-500" />} title="No upcoming interviews" description="Interviews will appear here once scheduled" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={interview.companyName || interview.candidateName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{interview.jobTitle}</h3>
                      <Badge variant="info">{interview.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{interview.companyName || 'Company'}</p>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{formatDate(interview.date, 'long')}</p>
                      <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{interview.startTime} ({interview.duration} min)</p>
                      <p className="flex items-center gap-1.5"><Video className="h-3 w-3" />Type: {interview.type}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                        onClick={() => setActiveScreeningInterview(interview)}
                      >
                        <Bot className="mr-2 h-4 w-4" />
                        Start AI Screening
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Candidate Screening Room Modal */}
      <CandidateScreeningRoom />
    </motion.div>
  )
}
