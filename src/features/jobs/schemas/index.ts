import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(1, 'At least one requirement is needed'),
  responsibilities: z.string().min(1, 'At least one responsibility is needed'),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  currency: z.string().default('USD'),
  hiringManager: z.string().optional(),
})

export type JobFormValues = z.infer<typeof jobSchema>
