export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  companyLogo?: string
  location: string
  appliedDate: string
  status: ApplicationStatus
  stages: ApplicationStage[]
  nextInterview?: { date: string; time: string; type: string }
  recruiterName?: string
}

export type ApplicationStatus =
  | 'applied' | 'under_review' | 'shortlisted'
  | 'interview_scheduled' | 'technical_round' | 'hr_round'
  | 'offer' | 'hired' | 'rejected'

export interface ApplicationStage {
  label: string
  date: string
  completed: boolean
  active: boolean
}

export const APPLICATION_STATUS_FLOW: { label: string; key: ApplicationStatus }[] = [
  { label: 'Applied', key: 'applied' },
  { label: 'Under Review', key: 'under_review' },
  { label: 'Shortlisted', key: 'shortlisted' },
  { label: 'Interview Scheduled', key: 'interview_scheduled' },
  { label: 'Technical Round', key: 'technical_round' },
  { label: 'HR Round', key: 'hr_round' },
  { label: 'Offer', key: 'offer' },
  { label: 'Hired', key: 'hired' },
]

export interface SavedJob {
  id: string
  jobId: string
  jobTitle: string
  company: string
  companyLogo?: string
  location: string
  salary: string
  type: string
  savedDate: string
}

export interface CandidateOffer {
  id: string
  jobTitle: string
  company: string
  offeredDate: string
  salary: string
  status: 'pending' | 'accepted' | 'rejected'
  expiresAt: string
  pdfUrl?: string
}
