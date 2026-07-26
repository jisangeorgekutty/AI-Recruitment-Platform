import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useJobStore } from '@/store/job-store'
import { ArrowLeft, ArrowRight, Plus, Trash2, HelpCircle, AlertTriangle } from 'lucide-react'

export function StepScreeningCriteria() {
  const { wizardDraft, setWizardDraft, setActiveWizardStep } = useJobStore()

  const [questionText, setQuestionText] = useState('')
  const [questionType, setQuestionType] = useState<'YesNo' | 'MultipleChoice' | 'Text'>('YesNo')
  const [optionsStr, setOptionsStr] = useState('')
  const [idealAnswer, setIdealAnswer] = useState('Yes')
  const [isKnockout, setIsKnockout] = useState(false)

  const handleAddQuestion = () => {
    if (!questionText.trim()) return

    let optionsJson: string | undefined = undefined
    if (questionType === 'MultipleChoice' && optionsStr.trim()) {
      const opts = optionsStr.split(',').map((s) => s.trim()).filter(Boolean)
      optionsJson = JSON.stringify(opts)
    }

    const updatedQuestions = [
      ...wizardDraft.screeningQuestions,
      {
        questionText: questionText.trim(),
        questionType,
        optionsJson,
        idealAnswer: idealAnswer.trim(),
        isKnockout,
        displayOrder: wizardDraft.screeningQuestions.length + 1,
      },
    ]

    setWizardDraft({ screeningQuestions: updatedQuestions })
    setQuestionText('')
    setOptionsStr('')
    setIdealAnswer('Yes')
    setIsKnockout(false)
  }

  const handleRemoveQuestion = (index: number) => {
    const updated = wizardDraft.screeningQuestions.filter((_, i) => i !== index)
    setWizardDraft({ screeningQuestions: updated })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Customizable Screening & Knock-out Questions</h3>
        <p className="text-sm text-muted-foreground">
          Configure mandatory questions candidates must answer. Knock-out questions automatically filter out non-qualifying candidates.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>Add Screening Question</span>
        </div>

        <div className="space-y-3">
          <Input
            id="questionText"
            label="Question Prompt *"
            placeholder="e.g. Do you have 3+ years experience with C# and .NET Core?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              id="questionType"
              label="Answer Format"
              value={questionType}
              onChange={(e) => {
                const val = e.target.value as any
                setQuestionType(val)
                if (val === 'YesNo') setIdealAnswer('Yes')
              }}
              options={[
                { value: 'YesNo', label: 'Yes / No' },
                { value: 'MultipleChoice', label: 'Multiple Choice' },
                { value: 'Text', label: 'Short Text' },
              ]}
            />

            {questionType === 'MultipleChoice' ? (
              <Input
                id="optionsStr"
                label="Options (Comma Separated)"
                placeholder="Option A, Option B, Option C"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
              />
            ) : (
              <Input
                id="idealAnswer"
                label="Ideal Required Answer"
                placeholder="e.g. Yes"
                value={idealAnswer}
                onChange={(e) => setIdealAnswer(e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isKnockout}
                onChange={(e) => setIsKnockout(e.target.checked)}
                className="h-4 w-4 rounded border-border text-amber-600 focus:ring-amber-500"
              />
              <AlertTriangle className="h-3.5 w-3.5" />
              Flag as Deal-Breaker / Knock-out Question (Must match Ideal Answer)
            </label>

            <Button type="button" variant="secondary" onClick={handleAddQuestion} disabled={!questionText.trim()}>
              <Plus className="mr-1 h-4 w-4" /> Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Added Questions List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Added Screening Questions ({wizardDraft.screeningQuestions.length})</h4>

        {wizardDraft.screeningQuestions.length > 0 ? (
          <div className="space-y-3">
            {wizardDraft.screeningQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start justify-between rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{idx + 1}. {q.questionText}</span>
                    {q.isKnockout && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-2.5 w-2.5" /> Knock-out
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Format: {q.questionType}</span>
                    <span>• Ideal: "{q.idealAnswer || 'N/A'}"</span>
                  </div>
                </div>

                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveQuestion(idx)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No screening questions added yet. You can proceed without questions or add them above.
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setActiveWizardStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={() => setActiveWizardStep(5)}>
          Next: Review & Publish <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
