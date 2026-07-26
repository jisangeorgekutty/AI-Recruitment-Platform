import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useJobStore } from '@/store/job-store'
import { ArrowRight } from 'lucide-react'

export function StepBasicInfo() {
  const { wizardDraft, setWizardDraft, setActiveWizardStep } = useJobStore()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wizardDraft.title || !wizardDraft.department) {
      return
    }
    setActiveWizardStep(2)
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Basic Role Information</h3>
        <p className="text-sm text-muted-foreground">Define the role title, department, and target experience level.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="title"
          label="Job Title *"
          placeholder="e.g. Senior Frontend Developer"
          value={wizardDraft.title}
          onChange={(e) => setWizardDraft({ title: e.target.value })}
          required
        />

        <Input
          id="department"
          label="Department *"
          placeholder="e.g. Engineering, Marketing, Sales"
          value={wizardDraft.department}
          onChange={(e) => setWizardDraft({ department: e.target.value })}
          required
        />

        <Select
          id="employmentType"
          label="Employment Type"
          value={wizardDraft.employmentType}
          onChange={(e) => setWizardDraft({ employmentType: e.target.value as any })}
          options={[
            { value: 'FullTime', label: 'Full Time' },
            { value: 'PartTime', label: 'Part Time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
          ]}
        />

        <Select
          id="experienceLevel"
          label="Experience Level"
          value={wizardDraft.experienceLevel}
          onChange={(e) => setWizardDraft({ experienceLevel: e.target.value as any })}
          options={[
            { value: 'Entry', label: 'Entry Level (0-2 yrs)' },
            { value: 'Mid', label: 'Mid Level (2-5 yrs)' },
            { value: 'Senior', label: 'Senior (5-8 yrs)' },
            { value: 'Lead', label: 'Lead / Principal (8+ yrs)' },
            { value: 'Executive', label: 'Executive / Director' },
          ]}
        />

        <Input
          id="hiringManager"
          label="Hiring Manager / Recruiter Lead"
          placeholder="e.g. Jane Doe (Optional)"
          value={wizardDraft.hiringManager || ''}
          onChange={(e) => setWizardDraft({ hiringManager: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={!wizardDraft.title || !wizardDraft.department}>
          Next: Location & Compensation <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
