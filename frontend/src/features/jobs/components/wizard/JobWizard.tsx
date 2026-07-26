import { useJobStore } from '@/store/job-store'
import { StepBasicInfo } from './StepBasicInfo'
import { StepLocationCompensation } from './StepLocationCompensation'
import { StepDescriptionSkills } from './StepDescriptionSkills'
import { StepScreeningCriteria } from './StepScreeningCriteria'
import { StepReviewPublish } from './StepReviewPublish'
import { Check } from 'lucide-react'

const steps = [
  { number: 1, title: 'Basic Details' },
  { number: 2, title: 'Location & Pay' },
  { number: 3, title: 'Overview & Skills' },
  { number: 4, title: 'Screening Criteria' },
  { number: 5, title: 'Review & Publish' },
]

export function JobWizard() {
  const { activeWizardStep, setActiveWizardStep } = useJobStore()

  return (
    <div className="space-y-8">
      {/* Step Stepper Header */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-4">
          {steps.map((step) => {
            const isCompleted = activeWizardStep > step.number
            const isCurrent = activeWizardStep === step.number

            return (
              <li key={step.number} className="md:flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) setActiveWizardStep(step.number)
                  }}
                  disabled={!isCompleted && !isCurrent}
                  className={`group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-3 transition-colors ${
                    isCompleted
                      ? 'border-primary text-primary hover:border-primary/80'
                      : isCurrent
                      ? 'border-primary text-foreground font-semibold'
                      : 'border-border text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center text-xs font-medium uppercase tracking-wider">
                    {isCompleted ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground mr-2">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span
                        className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                          isCurrent ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                    Step {step.number}
                  </span>
                  <span className="text-sm font-medium mt-1">{step.title}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Content Render */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {activeWizardStep === 1 && <StepBasicInfo />}
        {activeWizardStep === 2 && <StepLocationCompensation />}
        {activeWizardStep === 3 && <StepDescriptionSkills />}
        {activeWizardStep === 4 && <StepScreeningCriteria />}
        {activeWizardStep === 5 && <StepReviewPublish />}
      </div>
    </div>
  )
}
