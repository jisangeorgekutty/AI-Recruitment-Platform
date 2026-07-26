import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { jobApplicationService, type JobApplication } from '@/services/job-application.service'
import { useJobApplicationStore } from '@/store/job-application-store'
import { Send, Calendar, User, ChevronDown, Loader2, FileText, XCircle } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
  Applied: 'info',
  Screening: 'warning',
  Shortlisted: 'info',
  Interviewing: 'info',
  Offered: 'success',
  Rejected: 'destructive',
  Withdrawn: 'secondary',
}

export default function CandidateApplicationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const { applications, setApplications, updateApplicationStatus, isLoading, setLoading } = useJobApplicationStore()

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const data = await jobApplicationService.getMyApplications()
      setApplications(data || [])
    } catch (err: any) {
      toast.error('Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleWithdraw = async (id: number) => {
    try {
      await jobApplicationService.withdrawApplication(id)
      updateApplicationStatus(id, 'Withdrawn')
      toast.success('Application withdrawn successfully.')
    } catch (err: any) {
      toast.error('Failed to withdraw application.')
    }
  }

  const filtered = activeTab === 'all'
    ? applications
    : activeTab === 'active'
    ? applications.filter((a) => a.status !== 'Offered' && a.status !== 'Rejected' && a.status !== 'Withdrawn')
    : activeTab === 'offers'
    ? applications.filter((a) => a.status === 'Offered')
    : applications.filter((a) => a.status === 'Rejected' || a.status === 'Withdrawn')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="My Applications" description="Track all your job applications" />

      <Tabs
        tabs={[
          { value: 'all', label: 'All', count: applications.length },
          { value: 'active', label: 'Active', count: applications.filter((a) => a.status !== 'Offered' && a.status !== 'Rejected' && a.status !== 'Withdrawn').length },
          { value: 'offers', label: 'Offers', count: applications.filter((a) => a.status === 'Offered').length },
          { value: 'rejected', label: 'Rejected / Withdrawn', count: applications.filter((a) => a.status === 'Rejected' || a.status === 'Withdrawn').length },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Loading applications...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Send className="h-12 w-12" />}
          title="No applications found"
          description="Start applying to jobs that match your skills"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:border-primary/40 transition-all">
              <CardContent className="p-0">
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                >
                  <Avatar name={app.companyName || 'Company'} src={app.companyLogoUrl} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{app.jobTitle}</h3>
                      <Badge variant={statusBadgeVariant[app.status] || 'secondary'}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.companyName} • {app.location}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Applied {formatDate(app.appliedDate, 'relative')}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform mt-1', expanded === app.id && 'rotate-180')} />
                </div>

                {expanded === app.id && (
                  <div className="border-t px-5 py-4 bg-muted/30 space-y-4">
                    {app.resumeUrl && (
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Submitted Resume:</span>
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-primary underline font-semibold">
                          View Resume
                        </a>
                      </div>
                    )}

                    {app.coverLetter && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cover Letter</p>
                        <p className="text-xs text-muted-foreground bg-background p-3 rounded-lg border">{app.coverLetter}</p>
                      </div>
                    )}

                    {app.answers && app.answers.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Screening Answers</p>
                        <div className="space-y-2">
                          {app.answers.map((ans, idx) => (
                            <div key={idx} className="bg-background p-2.5 rounded-lg border text-xs">
                              <p className="font-semibold text-foreground">{ans.questionText || `Question #${ans.jobScreeningQuestionId}`}</p>
                              <p className="text-muted-foreground mt-0.5">{ans.answerText}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.status !== 'Withdrawn' && app.status !== 'Rejected' && app.status !== 'Offered' && (
                      <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleWithdraw(app.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Withdraw Application
                        </Button>
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
