import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useJobStore } from '@/store/job-store'
import { ArrowLeft, ArrowRight, DollarSign } from 'lucide-react'

export function StepLocationCompensation() {
  const { wizardDraft, setWizardDraft, setActiveWizardStep } = useJobStore()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wizardDraft.location) return
    setActiveWizardStep(3)
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Location & Compensation Range</h3>
        <p className="text-sm text-muted-foreground">Specify work arrangement, location, and annual salary band.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="remoteType"
          label="Workplace Arrangement"
          value={wizardDraft.remoteType}
          onChange={(e) => setWizardDraft({ remoteType: e.target.value as any })}
          options={[
            { value: 'OnSite', label: 'On-site' },
            { value: 'Hybrid', label: 'Hybrid' },
            { value: 'Remote', label: 'Fully Remote' },
          ]}
        />

        <Input
          id="location"
          label="Location / Office Hub *"
          placeholder="e.g. San Francisco, CA or Remote (US Only)"
          value={wizardDraft.location}
          onChange={(e) => setWizardDraft({ location: e.target.value })}
          required
        />
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <DollarSign className="h-4 w-4 text-primary" />
          <span>Annual Compensation Band</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="salaryMin"
            label="Minimum Salary"
            type="number"
            placeholder="50000"
            value={wizardDraft.salaryMin || ''}
            onChange={(e) => setWizardDraft({ salaryMin: e.target.value ? Number(e.target.value) : undefined })}
          />

          <Input
            id="salaryMax"
            label="Maximum Salary"
            type="number"
            placeholder="120000"
            value={wizardDraft.salaryMax || ''}
            onChange={(e) => setWizardDraft({ salaryMax: e.target.value ? Number(e.target.value) : undefined })}
          />

          <Select
            id="currency"
            label="Currency"
            value={wizardDraft.currency}
            onChange={(e) => setWizardDraft({ currency: e.target.value })}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'CAD', label: 'CAD (C$)' },
              { value: 'AUD', label: 'AUD (A$)' },
              { value: 'INR', label: 'INR (₹)' },
            ]}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={wizardDraft.showSalary}
            onChange={(e) => setWizardDraft({ showSalary: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Show salary range publicly on candidate job posting page
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setActiveWizardStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={!wizardDraft.location}>
          Next: Description & Skills <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
