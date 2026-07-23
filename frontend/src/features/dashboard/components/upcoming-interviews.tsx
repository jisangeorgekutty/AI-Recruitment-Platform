import { Calendar, Clock, Video, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import type { Interview } from '@/types'

interface UpcomingInterviewsProps {
  interviews: Interview[]
  isLoading: boolean
}

export function UpcomingInterviews({ interviews, isLoading }: UpcomingInterviewsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No upcoming interviews
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Interviews</CardTitle>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.slice(0, 5).map((interview) => (
          <div key={interview.id} className="flex items-start gap-3">
            <Avatar name={interview.candidateName} src={interview.candidateAvatar} size="sm" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{interview.candidateName}</span>
                <Badge variant="outline" className="text-xs">
                  {interview.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(interview.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {interview.startTime} - {interview.endTime}
                </span>
                {interview.type === 'video' && <Video className="h-3 w-3" />}
                {interview.location && <MapPin className="h-3 w-3" />}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
