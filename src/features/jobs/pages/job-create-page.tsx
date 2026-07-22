import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { JobForm } from '@/features/jobs/components/job-form'
import { jobService } from '@/services/job.service'
import type { JobFormValues } from '@/features/jobs/schemas'

export default function JobCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: JobFormValues) =>
      jobService.create({
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        experienceLevel: data.experienceLevel,
        description: data.description,
        requirements: data.requirements.split('\n').filter(Boolean),
        responsibilities: data.responsibilities.split('\n').filter(Boolean),
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
        currency: data.currency,
        hiringManager: data.hiringManager,
        status: 'published',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job created successfully')
      navigate('/jobs')
    },
    onError: () => {
      toast.error('Failed to create job')
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Job"
        description="Post a new job opening"
      />
      <Card>
        <CardContent className="p-6">
          <JobForm onSubmit={(data) => mutation.mutate(data)} isLoading={mutation.isPending} />
        </CardContent>
      </Card>
    </div>
  )
}
