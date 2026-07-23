import { Calendar, Clock, Video, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import type { Interview } from '@/types'

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
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={interview.candidateName} src={interview.candidateAvatar} size="lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold truncate">{interview.candidateName}</h3>
              <Badge variant={statusVariants[interview.status]}>{interview.status.replace('_', ' ')}</Badge>
              <Badge variant="outline">{interview.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(interview.date, 'long')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {interview.startTime} - {interview.endTime}
              </span>
              {interview.type === 'video' && (
                <span className="flex items-center gap-1 text-primary">
                  <Video className="h-3 w-3" />
                  Video Call
                </span>
              )}
              {interview.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {interview.location}
                </span>
              )}
            </div>
            {interview.interviewers.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {interview.interviewers.map((interviewer) => (
                    <Avatar
                      key={interviewer.id}
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
        </div>
      </CardContent>
    </Card>
  )
}
