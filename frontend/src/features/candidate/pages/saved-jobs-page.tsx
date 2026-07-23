import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Avatar } from '@/components/ui/avatar'
import { Heart, MapPin, DollarSign, Briefcase, X } from 'lucide-react'
import toast from 'react-hot-toast'

const savedJobs = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$150k - $220k', type: 'Full-time', savedDate: '2026-07-20' },
  { id: '2', title: 'Full Stack Developer', company: 'Stripe', location: 'Remote', salary: '$130k - $190k', type: 'Full-time', savedDate: '2026-07-18' },
]

export default function CandidateSavedJobsPage() {
  const handleRemove = (id: string) => {
    toast.success('Removed from saved jobs')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Saved Jobs" description="Jobs you've saved for later" />
      {savedJobs.length === 0 ? (
        <EmptyState icon={<Heart className="h-12 w-12" />} title="No saved jobs" description="Save jobs to review them later" action={{ label: 'Browse Jobs', onClick: () => {} }} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedJobs.map((job) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={job.company} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1">Apply Now</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleRemove(job.id)}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
