import type { Candidate, CandidateStage, CandidateStatus } from '@/types'

export type { Candidate, CandidateStage, CandidateStatus }

export const STAGE_LABELS: Record<CandidateStage, string> = {
  sourced: 'Sourced',
  applied: 'Applied',
  screened: 'AI Screened',
  shortlisted: 'Shortlisted',
  interview: 'Interview Scheduled',
  technical: 'Technical',
  offer: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
}

export const STAGE_COLORS: Record<CandidateStage, string> = {
  sourced: '#818cf8',
  applied: '#6366f1',
  screened: '#8b5cf6',
  shortlisted: '#a855f7',
  interview: '#ec4899',
  technical: '#f43f5e',
  offer: '#10b981',
  hired: '#06b6d4',
  rejected: '#f43f5e',
}
