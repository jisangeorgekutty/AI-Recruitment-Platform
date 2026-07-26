import { PageHeader } from '@/components/page-header'
import { JobWizard } from '@/features/jobs/components/wizard/JobWizard'

export default function JobCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Creation Wizard"
        description="Build a comprehensive job post with customizable screening criteria, knock-out dealbreakers, and skills."
      />
      <JobWizard />
    </div>
  )
}
