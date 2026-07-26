import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Avatar } from '@/components/ui/avatar'
import { Heart, MapPin, DollarSign, Briefcase, X, Loader2 } from 'lucide-react'
import { savedJobService } from '@/services/saved-job.service'
import { useSavedJobStore } from '@/store/saved-job-store'
import { ApplyModal } from '../components/ApplyModal'
import { useNavigate } from 'react-router-dom'
import type { Job } from '@/types'
import toast from 'react-hot-toast'

export default function CandidateSavedJobsPage() {
  const navigate = useNavigate()
  const { savedJobs, setSavedJobs, removeSavedJob, isLoading, setLoading } = useSavedJobStore()
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const fetchSavedJobs = async () => {
    setLoading(true)
    try {
      const data = await savedJobService.getMySavedJobs()
      setSavedJobs(data || [])
    } catch (err: any) {
      toast.error('Failed to load saved jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const handleRemove = async (jobId: number) => {
    try {
      await savedJobService.removeSavedJob(jobId)
      removeSavedJob(jobId)
      toast.success('Removed from saved jobs')
    } catch (err: any) {
      toast.error('Failed to remove saved job.')
    }
  }

  const handleOpenApply = (job: Job) => {
    setSelectedJobToApply(job)
    setIsApplyModalOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Saved Jobs" description="Jobs you've saved for later" />

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Loading saved jobs...
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="No saved jobs"
          description="Save jobs to review them later"
          action={{ label: 'Browse Jobs', onClick: () => navigate('/candidate/jobs') }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedJobs.map((item) => {
            const job = item.jobPosting
            if (!job) return null

            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="hover:border-primary/50 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar name={job.companyName || 'Company'} src={job.companyLogoUrl} size="lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold truncate">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.companyName}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                          {job.showSalary && job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                          )}
                          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.employmentType}</span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1" onClick={() => handleOpenApply(job)}>
                            Apply Now
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleRemove(item.jobPostingId)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {selectedJobToApply && (
        <ApplyModal
          job={selectedJobToApply}
          isOpen={isApplyModalOpen}
          onClose={() => { setIsApplyModalOpen(false); setSelectedJobToApply(null) }}
        />
      )}
    </motion.div>
  )
}
