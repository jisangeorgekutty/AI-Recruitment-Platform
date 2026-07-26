import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2, Copy, AlertTriangle, CheckCircle, HelpCircle, Code, Play, Pause } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { formatDate } from '@/lib/utils'
import { jobService } from '@/services/job.service'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDelete, setShowDelete] = useState(false)

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getById(id!),
    enabled: !!id,
  })

  const duplicateMutation = useMutation({
    mutationFn: () => jobService.duplicate(id!),
    onSuccess: (newJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job duplicated successfully!')
      if (newJob?.id) navigate(`/recruiter/jobs/${newJob.id}`)
    },
    onError: () => toast.error('Failed to duplicate job'),
  })

  const statusMutation = useMutation({
    mutationFn: (status: string) => jobService.updateStatus(id!, status),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success(`Job status updated to ${status}!`)
    },
    onError: () => toast.error('Failed to update job status'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => jobService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
      navigate('/recruiter/jobs')
    },
  })

  if (error) return <ErrorState onRetry={() => queryClient.invalidateQueries({ queryKey: ['job', id] })} />
  if (isLoading || !job) return <LoadingSkeleton type="detail" />

  const reqList = typeof job.requirements === 'string'
    ? job.requirements.split('\n').filter(Boolean)
    : Array.isArray(job.requirements) ? job.requirements : []

  const respList = typeof job.responsibilities === 'string'
    ? job.responsibilities.split('\n').filter(Boolean)
    : Array.isArray(job.responsibilities) ? job.responsibilities : []

  const currentStatus = job.status || 'Draft'

  return (
    <div className="space-y-6">
      <PageHeader
        title={job.title}
        description={`${job.department} • ${job.location} • ${job.remoteType || 'On-site'}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/recruiter/jobs')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={() => duplicateMutation.mutate()} loading={duplicateMutation.isPending}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <Button variant="destructive" onClick={() => setShowDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description & Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Skill Tagging */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" /> Required & Mandatory Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <div
                      key={i}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                        skill.isMandatory
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border bg-card text-foreground'
                      }`}
                    >
                      <span>{skill.skillName}</span>
                      <span className="text-[10px] opacity-75">({skill.minimumYearsExperience}y+ exp)</span>
                      {skill.isMandatory && <CheckCircle className="h-3 w-3 text-primary" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Screening & Knockout Questions */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" /> Candidate Screening Criteria ({job.screeningQuestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.screeningQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start justify-between rounded-xl border border-border/80 bg-muted/20 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{idx + 1}. {q.questionText}</span>
                        {q.isKnockout && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-2.5 w-2.5" /> Knock-out Question
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Type: {q.questionType} | Ideal Answer: <span className="font-semibold">{q.idealAnswer || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {reqList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reqList.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Responsibilities */}
          {respList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {respList.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Lifecycle & Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={currentStatus === 'Active' || currentStatus === 'published' ? 'success' : currentStatus === 'Draft' ? 'warning' : 'secondary'}>
                  {currentStatus}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Employment Type</span>
                <span className="font-medium">{job.employmentType || job.type}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience Level</span>
                <span className="font-medium">{job.experienceLevel}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Workplace</span>
                <span className="font-medium">{job.remoteType || 'On-site'}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Applications Received</span>
                <span className="font-medium">{job.applicationsCount ?? 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Views</span>
                <span className="font-medium">{job.viewsCount ?? 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Salary Range</span>
                <span className="font-medium">
                  {job.salaryMin || job.salaryMax
                    ? `${job.currency === 'USD' ? '$' : job.currency} ${job.salaryMin ? job.salaryMin.toLocaleString() : '0'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}`
                    : 'Not specified'}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created On</span>
                <span className="font-medium">{formatDate(job.createdOn || job.createdAt || new Date().toISOString(), 'short')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Lifecycle Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentStatus !== 'Active' && currentStatus !== 'published' && (
                <Button variant="default" className="w-full justify-start" onClick={() => statusMutation.mutate('Active')}>
                  <Play className="mr-2 h-4 w-4" /> Publish Job Opening
                </Button>
              )}
              {currentStatus === 'Active' || currentStatus === 'published' ? (
                <Button variant="outline" className="w-full justify-start" onClick={() => statusMutation.mutate('Paused')}>
                  <Pause className="mr-2 h-4 w-4 text-amber-500" /> Pause Hiring
                </Button>
              ) : null}
              {currentStatus !== 'Closed' && currentStatus !== 'closed' && (
                <Button variant="outline" className="w-full justify-start" onClick={() => statusMutation.mutate('Closed')}>
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Close Position
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
