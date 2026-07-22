import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { APPLICATION_STATUS_FLOW, type Application } from '@/features/candidate/types'
import { Send, Calendar, User, ChevronDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useState } from 'react'

const sampleApplications: Application[] = [
  {
    id: '1', jobId: 'j1', jobTitle: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA',
    appliedDate: '2026-07-15', status: 'interview_scheduled',
    stages: [
      { label: 'Applied', date: '2026-07-15', completed: true, active: false },
      { label: 'Under Review', date: '2026-07-18', completed: true, active: false },
      { label: 'Shortlisted', date: '2026-07-20', completed: true, active: false },
      { label: 'Interview Scheduled', date: '2026-07-25', completed: false, active: true },
    ],
    nextInterview: { date: '2026-07-25', time: '10:00 AM', type: 'Video Call' },
    recruiterName: 'Sarah Chen',
  },
  {
    id: '2', jobId: 'j2', jobTitle: 'Full Stack Developer', company: 'Stripe', location: 'Remote',
    appliedDate: '2026-07-10', status: 'under_review',
    stages: [
      { label: 'Applied', date: '2026-07-10', completed: true, active: false },
      { label: 'Under Review', date: '2026-07-14', completed: false, active: true },
    ],
  },
  {
    id: '3', jobId: 'j3', jobTitle: 'Product Designer', company: 'Figma', location: 'San Francisco, CA',
    appliedDate: '2026-06-28', status: 'offer',
    stages: [
      { label: 'Applied', date: '2026-06-28', completed: true, active: false },
      { label: 'Under Review', date: '2026-07-02', completed: true, active: false },
      { label: 'Shortlisted', date: '2026-07-05', completed: true, active: false },
      { label: 'Interview Scheduled', date: '2026-07-08', completed: true, active: false },
      { label: 'Technical Round', date: '2026-07-12', completed: true, active: false },
      { label: 'HR Round', date: '2026-07-16', completed: true, active: false },
      { label: 'Offer', date: '2026-07-20', completed: true, active: true },
    ],
    recruiterName: 'Mike Johnson',
  },
]

function ApplicationTimeline({ stages }: { stages: Application['stages'] }) {
  return (
    <div className="space-y-0">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
              stage.completed ? 'border-primary bg-primary' : stage.active ? 'border-primary bg-background' : 'border-muted bg-background',
            )}>
              {stage.completed && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
            </div>
            {i < stages.length - 1 && <div className={cn('w-0.5 flex-1', stage.completed ? 'bg-primary' : 'bg-muted')} />}
          </div>
          <div className={cn('pb-6', i === stages.length - 1 && 'pb-0')}>
            <p className={cn('text-sm', stage.completed ? 'font-medium' : stage.active ? 'font-semibold text-primary' : 'text-muted-foreground')}>
              {stage.label}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(stage.date, 'short')}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
  applied: 'info', under_review: 'warning', shortlisted: 'info',
  interview_scheduled: 'info', technical_round: 'warning', hr_round: 'warning',
  offer: 'success', hired: 'success', rejected: 'destructive',
}

export default function CandidateApplicationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const apps = sampleApplications

  const filtered = activeTab === 'all' ? apps : apps.filter((a) => a.status === activeTab)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="My Applications" description="Track all your job applications" />
      <Tabs
        tabs={[
          { value: 'all', label: 'All', count: apps.length },
          { value: 'active', label: 'Active', count: apps.filter((a) => a.status !== 'offer' && a.status !== 'hired' && a.status !== 'rejected').length },
          { value: 'offer', label: 'Offers', count: apps.filter((a) => a.status === 'offer').length },
          { value: 'rejected', label: 'Rejected', count: apps.filter((a) => a.status === 'rejected').length },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {filtered.length === 0 ? (
        <EmptyState icon={<Send className="h-12 w-12" />} title="No applications yet" description="Start applying to jobs that match your skills" action={{ label: 'Browse Jobs', onClick: () => {} }} />
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                  <Avatar name={app.company} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{app.jobTitle}</h3>
                      <Badge variant={statusBadgeVariant[app.status]}>{app.status.replace(/_/g, ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.company} • {app.location}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Applied {formatDate(app.appliedDate, 'relative')}</span>
                      {app.nextInterview && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{app.nextInterview.date}</span>}
                      {app.recruiterName && <span className="flex items-center gap-1"><User className="h-3 w-3" />{app.recruiterName}</span>}
                    </div>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform mt-1', expanded === app.id && 'rotate-180')} />
                </div>
                {expanded === app.id && (
                  <div className="border-t px-5 py-4 bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Application Timeline</p>
                    <ApplicationTimeline stages={app.stages} />
                    {app.nextInterview && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/5 p-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Upcoming Interview</p>
                          <p className="text-xs text-muted-foreground">{app.nextInterview.date} at {app.nextInterview.time} • {app.nextInterview.type}</p>
                        </div>
                        <Button size="sm">Join</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
