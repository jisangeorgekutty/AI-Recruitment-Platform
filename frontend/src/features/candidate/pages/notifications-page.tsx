import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { Bell, CheckCheck, Calendar, Send, Gift, Info } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const notifications = [
  { id: '1', type: 'interview', title: 'Interview Scheduled', message: 'Your interview with Google has been scheduled for July 25 at 10:00 AM.', time: '2026-07-20T10:00:00', read: false },
  { id: '2', type: 'application', title: 'Application Under Review', message: 'Stripe is reviewing your application for Full Stack Developer.', time: '2026-07-18T14:30:00', read: false },
  { id: '3', type: 'offer', title: 'Offer Received!', message: 'Figma has sent you an offer letter for Product Designer.', time: '2026-07-20T09:00:00', read: true },
  { id: '4', type: 'system', title: 'Profile Update Reminder', message: 'Complete your profile to increase visibility to recruiters.', time: '2026-07-15T08:00:00', read: true },
]

const icons = { interview: Calendar, application: Send, offer: Gift, system: Info }

export default function CandidateNotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Notifications" description="Stay updated with your applications" actions={<Button variant="outline" size="sm"><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>} />
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-12 w-12" />} title="No notifications" description="You're all caught up" />
      ) : (
        <div className="max-w-2xl space-y-1">
          {notifications.map((n) => {
            const Icon = icons[n.type as keyof typeof icons]
            return (
              <div key={n.id} className={cn('flex items-start gap-3 rounded-xl p-4 transition-colors', !n.read && 'bg-primary/5')}>
                <div className={cn('rounded-lg p-2', n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary')}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !n.read && 'font-semibold')}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(n.time, 'relative')}</p>
                </div>
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
