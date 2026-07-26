import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PageHeader } from '@/components/page-header'
import { Avatar } from '@/components/ui/avatar'
import { Search, MapPin, Heart, Briefcase, DollarSign, Loader2 } from 'lucide-react'
import { jobSearchService } from '@/services/job-search.service'
import { savedJobService } from '@/services/saved-job.service'
import { ApplyModal } from '../components/ApplyModal'
import type { Job } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CandidateJobSearchPage() {
  const [search, setSearch] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [remoteType, setRemoteType] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [savedSet, setSavedSet] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const paged = await jobSearchService.searchJobs({
        search: search || undefined,
        employmentType: employmentType || undefined,
        remoteType: remoteType || undefined,
        status: 'Active',
      })
      setJobs(paged?.items || paged?.data || [])

      // Collect saved job ids
      const savedList = await savedJobService.getMySavedJobs().catch(() => [])
      if (savedList) {
        setSavedSet(new Set(savedList.map((s) => Number(s.jobPostingId))))
      }
    } catch (err: any) {
      toast.error('Failed to search jobs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, employmentType, remoteType])

  const toggleSaved = async (e: React.MouseEvent, jobId: number | string) => {
    e.stopPropagation()
    const numericId = Number(jobId)
    const isCurrentlySaved = savedSet.has(numericId)

    try {
      if (isCurrentlySaved) {
        await savedJobService.removeSavedJob(numericId)
        setSavedSet((prev) => {
          const next = new Set(prev)
          next.delete(numericId)
          return next
        })
        toast.success('Removed from saved jobs')
      } else {
        await savedJobService.saveJob(numericId)
        setSavedSet((prev) => new Set(prev).add(numericId))
        toast.success('Job saved successfully!')
      }
    } catch (err: any) {
      toast.error('Failed to update saved job.')
    }
  }

  const handleOpenApply = (job: Job) => {
    setSelectedJobToApply(job)
    setIsApplyModalOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Find Your Next Role" description="Discover opportunities that match your skills" />

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, skill, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          options={[
            { value: '', label: 'All Types' },
            { value: 'FullTime', label: 'Full-time' },
            { value: 'PartTime', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
          ]}
          className="w-36"
        />

        <Select
          value={remoteType}
          onChange={(e) => setRemoteType(e.target.value)}
          options={[
            { value: '', label: 'All Locations' },
            { value: 'Remote', label: 'Remote' },
            { value: 'Hybrid', label: 'Hybrid' },
            { value: 'OnSite', label: 'On-site' },
          ]}
          className="w-36"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Searching job openings...
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl space-y-2">
          <p className="text-base font-semibold">No active jobs found</p>
          <p className="text-sm text-muted-foreground">Try clearing filters or searching for another role title.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => {
            const numId = Number(job.id)
            const isSaved = savedSet.has(numId)

            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
                <Card className="cursor-pointer h-full hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between">
                  <CardContent className="p-5 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar name={job.companyName || 'Company'} src={job.companyLogoUrl} size="lg" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold truncate">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.companyName}</p>

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                              {job.showSalary && job.salaryMin && job.salaryMax && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.employmentType}</span>
                              <Badge variant="secondary" className="text-[10px]">{job.remoteType}</Badge>
                            </div>

                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {job.skills.map((skill) => (
                                  <Badge key={skill.id || skill.skillName} variant="outline" className="text-[10px]">
                                    {skill.skillName}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-3">
                              Posted {formatDate(job.createdOn || job.createdAt || new Date(), 'relative')}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => toggleSaved(e, job.id)}
                          className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent transition-colors"
                          title={isSaved ? 'Remove saved job' : 'Save job'}
                        >
                          <Heart className={cn('h-4 w-4', isSaved && 'fill-red-500 text-red-500')} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-2 border-t">
                      <Button size="sm" className="flex-1" onClick={() => handleOpenApply(job)}>
                        Quick Apply
                      </Button>
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
