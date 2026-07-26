import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useJobStore } from '@/store/job-store'
import { jobService } from '@/services/job.service'
import { ArrowLeft, Check, Sparkles, Building2, MapPin, Briefcase, DollarSign, HelpCircle, FileText } from 'lucide-react'

export function StepReviewPublish() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { wizardDraft, resetWizardDraft, setActiveWizardStep } = useJobStore()

  const createMutation = useMutation({
    mutationFn: (status: 'Draft' | 'Active') =>
      jobService.create({
        title: wizardDraft.title,
        department: wizardDraft.department,
        location: wizardDraft.location,
        remoteType: wizardDraft.remoteType,
        employmentType: wizardDraft.employmentType,
        experienceLevel: wizardDraft.experienceLevel,
        description: wizardDraft.description,
        requirements: wizardDraft.requirements,
        responsibilities: wizardDraft.responsibilities,
        salaryMin: wizardDraft.salaryMin,
        salaryMax: wizardDraft.salaryMax,
        currency: wizardDraft.currency,
        showSalary: wizardDraft.showSalary,
        hiringManager: wizardDraft.hiringManager,
        status: status,
        skills: wizardDraft.skills,
        screeningQuestions: wizardDraft.screeningQuestions,
      }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job-stats'] })
      toast.success(status === 'Active' ? 'Job posting published successfully!' : 'Job saved as draft!')
      resetWizardDraft()
      navigate('/recruiter/jobs')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create job posting')
    },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Final Review & Publish</h3>
        <p className="text-sm text-muted-foreground">Verify all job details before publishing live or saving as draft.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm">
        {/* Header Preview */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded font-medium px-2 py-0.5 text-xs bg-primary/10 text-primary">
                {wizardDraft.department}
              </span>
              <span className="rounded font-medium px-2 py-0.5 text-xs bg-secondary/10 text-secondary">
                {wizardDraft.employmentType}
              </span>
              <span className="rounded font-medium px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                {wizardDraft.remoteType}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-2">{wizardDraft.title}</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {wizardDraft.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {wizardDraft.experienceLevel} Level</span>
              {wizardDraft.hiringManager && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Lead: {wizardDraft.hiringManager}</span>}
            </div>
          </div>

          {wizardDraft.showSalary && wizardDraft.salaryMin && wizardDraft.salaryMax && (
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Salary Range</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {wizardDraft.currency === 'USD' ? '$' : wizardDraft.currency} {wizardDraft.salaryMin.toLocaleString()} - {wizardDraft.salaryMax.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Description & Skill Tags */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> Job Description
            </h4>
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {wizardDraft.description}
            </p>
          </div>

          {wizardDraft.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Tagged Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {wizardDraft.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-secondary/15 text-secondary text-xs font-medium">
                    {skill.skillName} ({skill.minimumYearsExperience}y+) {skill.isMandatory && '★ Mandatory'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {wizardDraft.screeningQuestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> Screening Questions ({wizardDraft.screeningQuestions.length})
              </h4>
              <div className="space-y-2">
                {wizardDraft.screeningQuestions.map((q, idx) => (
                  <div key={idx} className="rounded-lg bg-muted/40 p-3 text-xs flex justify-between">
                    <span>{idx + 1}. {q.questionText}</span>
                    <span className="font-medium text-muted-foreground">{q.isKnockout ? 'Knock-out Dealbreaker' : q.questionType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setActiveWizardStep(4)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Screening
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            loading={createMutation.isPending}
            onClick={() => createMutation.mutate('Draft')}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            loading={createMutation.isPending}
            onClick={() => createMutation.mutate('Active')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Publish Job Opening
          </Button>
        </div>
      </div>
    </div>
  )
}
