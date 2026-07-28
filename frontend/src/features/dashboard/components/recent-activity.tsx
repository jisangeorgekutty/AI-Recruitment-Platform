import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { type Activity } from '@/types'

interface RecentActivityProps {
  activities: Activity[]
  isLoading: boolean
}

const activityVariants: Record<string, 'info' | 'success' | 'warning' | 'default' | 'destructive'> = {
  application_received: 'info',
  interview_scheduled: 'warning',
  interview_completed: 'info',
  offer_sent: 'success',
  offer_accepted: 'success',
  candidate_hired: 'success',
  candidate_rejected: 'destructive',
  job_published: 'info',
}

const activityLabels: Record<string, string> = {
  application_received: 'Application Received',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Completed',
  offer_sent: 'Offer Sent',
  offer_accepted: 'Offer Accepted',
  candidate_hired: 'Candidate Hired',
  candidate_rejected: 'Candidate Rejected',
  job_published: 'Job Published',
  note_added: 'Note Added',
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {activities.map((activity) => {
          const userName = activity.user?.name || activity.userName || 'System'
          const userAvatar = activity.user?.avatar || activity.userAvatar
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar name={userName} src={userAvatar} size="sm" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={activityVariants[activity.type] || 'default'}>
                    {activityLabels[activity.type] || activity.type}
                  </Badge>
                </div>
                <p className="text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp, 'relative')}</p>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
