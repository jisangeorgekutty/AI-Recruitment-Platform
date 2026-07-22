import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Calendar, Clock, Video, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const upcomingInterviews = [
  { id: '1', company: 'Google', role: 'Senior Frontend Engineer', date: '2026-07-25', time: '10:00 AM', duration: '60 min', type: 'Video Call', interviewer: 'Sarah Chen' },
  { id: '2', company: 'Stripe', role: 'Full Stack Developer', date: '2026-07-28', time: '2:00 PM', duration: '45 min', type: 'Technical', interviewer: 'Alex Kim' },
]

export default function CandidateInterviewsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Upcoming Interviews" description="Your scheduled interviews" />
      {upcomingInterviews.length === 0 ? (
        <EmptyState icon={<Calendar className="h-12 w-12" />} title="No upcoming interviews" description="Interviews will appear here once scheduled" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={interview.company} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{interview.role}</h3>
                      <Badge variant="info">{interview.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{interview.company}</p>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{formatDate(interview.date, 'long')}</p>
                      <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{interview.time} ({interview.duration})</p>
                      <p className="flex items-center gap-1.5"><Video className="h-3 w-3" />Interviewer: {interview.interviewer}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1"><Video className="mr-2 h-4 w-4" />Join Meeting</Button>
                      <Button size="sm" variant="outline" className="flex-1">Reschedule</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
