import { useState, useEffect } from 'react'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Loader2, Send, HelpCircle } from 'lucide-react'
import { candidateResumeService, type CandidateResumeItem } from '@/services/candidate-resume.service'
import { jobApplicationService } from '@/services/job-application.service'
import { useJobApplicationStore } from '@/store/job-application-store'
import type { Job } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ApplyModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const [resumes, setResumes] = useState<CandidateResumeItem[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [answers, setAnswers] = useState<Record<number | string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingResumes, setIsLoadingResumes] = useState(false)

  const { addApplication } = useJobApplicationStore()

  useEffect(() => {
    if (isOpen) {
      setIsLoadingResumes(true)
      candidateResumeService.getMyResumes()
        .then((items) => {
          setResumes(items || [])
          const primary = items?.find((r) => r.isPrimary) || items?.[0]
          if (primary) setSelectedResumeId(primary.id)
        })
        .catch(() => {})
        .finally(() => setIsLoadingResumes(false))
    }
  }, [isOpen])

  if (!job) return null

  const handleAnswerChange = (questionId: number | string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('jobPostingId', String(job.id))

      if (selectedResumeId) {
        formData.append('candidateResumeId', String(selectedResumeId))
      }

      if (customFile) {
        formData.append('customResumeFile', customFile)
      }

      if (coverLetter) {
        formData.append('coverLetter', coverLetter)
      }

      let ansIndex = 0
      Object.entries(answers).forEach(([qId, text]) => {
        if (text.trim()) {
          formData.append(`answers[${ansIndex}].jobScreeningQuestionId`, String(qId))
          formData.append(`answers[${ansIndex}].answerText`, text.trim())
          ansIndex++
        }
      })

      const newApp = await jobApplicationService.apply(formData)
      addApplication(newApp)
      toast.success('Application submitted successfully!')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={`Apply for ${job.title}`}
      description={`${job.companyName || 'Company'} • ${job.location}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-2">
        {/* Resume Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold block">Select Resume</label>

          {isLoadingResumes ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your saved resumes...
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid gap-2">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => { setSelectedResumeId(r.id); setCustomFile(null) }}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedResumeId === r.id && !customFile ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{r.fileName}</p>
                      <p className="text-xs text-muted-foreground">{(r.fileSize / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                  </div>
                  {r.isPrimary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                </div>
              ))}
            </div>
          ) : null}

          {/* Custom Resume Upload Option */}
          <div className="mt-2">
            <label className="text-xs text-muted-foreground mb-1 block">Or Upload Custom Resume (PDF/DOCX)</label>
            <div className="relative border border-dashed rounded-xl p-3 text-center hover:bg-accent/50 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCustomFile(e.target.files[0])
                    setSelectedResumeId(null)
                  }
                }}
              />
              <div className="flex items-center justify-center gap-2 text-xs font-medium">
                <Upload className="h-4 w-4 text-primary" />
                {customFile ? <span className="text-primary font-semibold">{customFile.name}</span> : <span>Choose file to upload</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="space-y-2">
          <label htmlFor="coverLetter" className="text-sm font-semibold block">Cover Letter (Optional)</label>
          <Textarea
            id="coverLetter"
            placeholder="Why are you a great fit for this position?"
            rows={3}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {/* Screening Questions */}
        {job.screeningQuestions && job.screeningQuestions.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <label className="text-sm font-semibold block">Screening Questions</label>
            </div>

            {job.screeningQuestions.map((q) => {
              if (!q.id) return null
              const currentAns = answers[q.id] || ''

              // Parse options if MultipleChoice
              let options: string[] = []
              if (q.questionType === 'MultipleChoice') {
                if (q.optionsJson) {
                  try {
                    const parsed = JSON.parse(q.optionsJson)
                    if (Array.isArray(parsed)) options = parsed
                    else if (typeof parsed === 'string') options = parsed.split(',').map((s) => s.trim()).filter(Boolean)
                  } catch {
                    options = q.optionsJson.split(',').map((s) => s.trim()).filter(Boolean)
                  }
                }
                if (options.length === 0) options = ['Option 1', 'Option 2']
              }

              return (
                <div key={q.id} className="space-y-2 rounded-xl border bg-muted/20 p-3.5">
                  <label htmlFor={`q-${q.id}`} className="text-xs font-semibold text-foreground block">
                    {q.questionText} {q.isKnockout && <span className="text-amber-500 font-bold text-[10px] ml-1">(Required)</span>}
                  </label>

                  {q.questionType === 'YesNo' ? (
                    <div className="flex gap-2 pt-1">
                      {['Yes', 'No'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(q.id!, opt)}
                          className={cn(
                            "px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex-1 sm:flex-none",
                            currentAns === opt
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background hover:bg-accent border-input text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.questionType === 'MultipleChoice' ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(q.id!, opt)}
                          className={cn(
                            "px-3.5 py-2 text-xs font-medium rounded-xl border transition-all",
                            currentAns === opt
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background hover:bg-accent border-input text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Input
                      id={`q-${q.id}`}
                      placeholder="Your answer..."
                      value={currentAns}
                      onChange={(e) => handleAnswerChange(q.id!, e.target.value)}
                      className="bg-background"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Application
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
