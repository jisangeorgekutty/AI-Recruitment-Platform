import { Calendar, Clock, Video, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import type { Interview } from '@/types'
import { useInterviewStore } from '@/store/interview-store'

interface InterviewCardProps {
  interview: Interview
  onClick?: () => void
}

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
  scheduled: 'info',
  confirmed: 'success',
  in_progress: 'warning',
  completed: 'secondary',
  cancelled: 'destructive',
  rescheduled: 'warning',
}

export function InterviewCard({ interview, onClick }: InterviewCardProps) {
  const statusKey = (interview?.status || 'scheduled').toString().toLowerCase()
  const statusVariant = statusVariants[statusKey] || 'info'
  const displayStatus = (interview?.status || 'scheduled').toString().replace('_', ' ')
  const interviewersList = Array.isArray(interview?.interviewers) ? interview.interviewers : []

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={interview?.candidateName || 'Candidate'} src={interview?.candidateAvatar} size="lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold truncate">{interview?.candidateName || 'Candidate'}</h3>
              <Badge variant={statusVariant}>{displayStatus}</Badge>
              <Badge variant="outline">{interview?.type || 'ai_screening'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{interview?.jobTitle || 'Position'}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {interview?.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(interview.date, 'long')}
                </span>
              )}
              {interview?.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {interview.startTime} {interview.endTime ? `- ${interview.endTime}` : ''}
                </span>
              )}
              {(interview?.type === 'video' || interview?.type === 'ai_screening') && (
                <span className="flex items-center gap-1 text-primary">
                  <Video className="h-3 w-3" />
                  {interview.type === 'ai_screening' ? 'AI Screening Session' : 'Video Call'}
                </span>
              )}
              {interview?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {interview.location}
                </span>
              )}
            </div>
            {interviewersList.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {interviewersList.map((interviewer) => (
                    <Avatar
                      key={interviewer.id || interviewer.name}
                      name={interviewer.name}
                      src={interviewer.avatar}
                      size="sm"
                      className="border-2 border-background"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                const { setActiveScorecardInterview } = useInterviewStore.getState()
                setActiveScorecardInterview(interview)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-all"
            >
              <span>View AI Scorecard</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
