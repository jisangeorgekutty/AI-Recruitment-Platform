import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { jobSchema, type JobFormValues } from '../schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

interface JobFormProps {
  defaultValues?: Partial<JobFormValues>
  onSubmit: (data: JobFormValues) => void
  isLoading?: boolean
}

export function JobForm({ defaultValues, onSubmit, isLoading }: JobFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema as any) as any,
    defaultValues: {
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      experienceLevel: 'mid',
      description: '',
      requirements: '',
      responsibilities: '',
      currency: 'USD',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="title"
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          id="department"
          label="Department"
          placeholder="e.g. Engineering"
          error={errors.department?.message}
          {...register('department')}
        />
        <Input
          id="location"
          label="Location"
          placeholder="e.g. San Francisco, CA or Remote"
          error={errors.location?.message}
          {...register('location')}
        />
        <Select
          id="type"
          label="Employment Type"
          options={[
            { value: 'full-time', label: 'Full Time' },
            { value: 'part-time', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Internship' },
            { value: 'remote', label: 'Remote' },
          ]}
          error={errors.type?.message}
          {...register('type')}
        />
        <Select
          id="experienceLevel"
          label="Experience Level"
          options={[
            { value: 'entry', label: 'Entry Level' },
            { value: 'mid', label: 'Mid Level' },
            { value: 'senior', label: 'Senior' },
            { value: 'lead', label: 'Lead' },
            { value: 'executive', label: 'Executive' },
          ]}
          error={errors.experienceLevel?.message}
          {...register('experienceLevel')}
        />
        <Input
          id="hiringManager"
          label="Hiring Manager"
          placeholder="Optional"
          error={errors.hiringManager?.message}
          {...register('hiringManager')}
        />
      </div>

      <Textarea
        id="description"
        label="Job Description"
        placeholder="Describe the role, responsibilities, and ideal candidate..."
        rows={5}
        error={errors.description?.message}
        {...register('description')}
      />

      <Textarea
        id="requirements"
        label="Requirements"
        placeholder="List the key requirements (one per line)..."
        rows={4}
        error={errors.requirements?.message}
        {...register('requirements')}
      />

      <Textarea
        id="responsibilities"
        label="Responsibilities"
        placeholder="List the key responsibilities (one per line)..."
        rows={4}
        error={errors.responsibilities?.message}
        {...register('responsibilities')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="salaryMin"
          label="Salary Min"
          type="number"
          placeholder="50000"
          error={errors.salaryMin?.message}
          {...register('salaryMin')}
        />
        <Input
          id="salaryMax"
          label="Salary Max"
          type="number"
          placeholder="150000"
          error={errors.salaryMax?.message}
          {...register('salaryMax')}
        />
        <Select
          id="currency"
          label="Currency"
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'CAD', label: 'CAD (C$)' },
            { value: 'AUD', label: 'AUD (A$)' },
          ]}
          {...register('currency')}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" loading={isLoading}>
          Publish Job
        </Button>
      </div>
    </form>
  )
}
