export interface User {
  id: number | string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'recruiter' | 'candidate'
  companyId?: string
  isOnboardingCompleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface Company {
  id?: number | string
  userId?: number
  companyName: string
  companyLogoUrl?: string
  name?: string
  logo?: string
  website?: string
  industry?: string
  companySize?: string
  size?: string
  description?: string
  location?: string
  contactEmail?: string
  contactPhone?: string
  establishedYear?: number
  registrationNumber?: string
  createdAt?: string
  updatedAt?: string
}

export interface JobSkill {
  id?: number | string
  jobPostingId?: number | string
  skillName: string
  isMandatory: boolean
  minimumYearsExperience: number
  displayOrder?: number
}

export interface JobScreeningQuestion {
  id?: number | string
  jobPostingId?: number | string
  questionText: string
  questionType: 'YesNo' | 'MultipleChoice' | 'Text'
  optionsJson?: string
  idealAnswer?: string
  isKnockout: boolean
  displayOrder?: number
}

export interface Job {
  id: number | string
  companyProfileId?: number
  companyName?: string
  companyLogoUrl?: string
  title: string
  department: string
  location: string
  remoteType?: 'OnSite' | 'Remote' | 'Hybrid' | string
  employmentType?: 'FullTime' | 'PartTime' | 'Contract' | 'Internship' | string
  type?: string
  status: 'Draft' | 'Active' | 'Paused' | 'Closed' | 'Archived' | 'draft' | 'published' | 'closed' | 'archived' | string
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive' | string
  description: string
  requirements?: string
  responsibilities?: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  showSalary?: boolean
  applicationsCount: number
  viewsCount: number
  createdOn?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  hiringManager?: string
  skills?: JobSkill[]
  screeningQuestions?: JobScreeningQuestion[]
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  position?: string
  location?: string
  stage: CandidateStage
  status: CandidateStatus
  skills: string[]
  experience: Experience[]
  education: Education[]
  resumeUrl?: string
  resumeScore?: number
  appliedDate: string
  source: string
  notes?: string
  jobId: string
  jobTitle?: string
  rating: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type CandidateStage = 'sourced' | 'applied' | 'screened' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected'
export type CandidateStatus = 'active' | 'passive' | 'placed' | 'archived'

export interface Experience {
  id: string
  company: string
  title: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: number
}

export interface Interview {
  id: string
  title: string
  candidateId: string
  candidateName: string
  candidateAvatar?: string
  jobId: string
  jobTitle: string
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'panel'
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled'
  date: string
  startTime: string
  endTime: string
  duration: number
  location?: string
  meetingLink?: string
  interviewerIds: string[]
  interviewers: { id: string; name: string; avatar?: string }[]
  notes?: string
  feedback?: InterviewFeedback
  createdAt: string
  updatedAt: string
}

export interface InterviewFeedback {
  id: string
  rating: number
  strengths: string[]
  weaknesses: string[]
  notes: string
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no'
  submittedBy: string
  submittedAt: string
}

export interface Resume {
  id: string
  candidateId: string
  fileName: string
  fileUrl: string
  fileSize: number
  parsed: boolean
  data?: ParsedResume
  score?: ResumeScore
  uploadedAt: string
}

export interface ParsedResume {
  name: string
  email: string
  phone?: string
  location?: string
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  certifications: string[]
  languages: string[]
  totalYearsExperience: number
}

export interface ResumeScore {
  overall: number
  skills: number
  experience: number
  education: number
  achievements: number
  recommendations: string[]
}

export interface Notification {
  id: string
  type: 'application' | 'interview' | 'offer' | 'system' | 'message' | 'reminder'
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalCandidates: number
  totalInterviews: number
  interviewsThisWeek: number
  offersSent: number
  acceptanceRate: number
  timeToHire: number
  applicationsThisMonth: number
  candidatesHired: number
  revenueImpact?: number
}

export interface Activity {
  id: string
  type: 'application_received' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'offer_accepted' | 'candidate_hired' | 'candidate_rejected' | 'job_published' | 'note_added'
  title: string
  description: string
  user: { name: string; avatar?: string }
  timestamp: string
}

export interface PaginatedResponse<T> {
  items?: T[]
  data?: T[]
  totalCount?: number
  total?: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface TableFilters {
  search?: string
  status?: string
  stage?: string
  department?: string
  type?: string
  dateRange?: [string, string]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
