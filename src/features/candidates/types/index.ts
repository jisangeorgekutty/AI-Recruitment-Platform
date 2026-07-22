import type { Candidate, CandidateStage, CandidateStatus } from '@/types'

export type { Candidate, CandidateStage, CandidateStatus }

export const STAGE_LABELS: Record<CandidateStage, string> = {
  sourced: 'Sourced',
  applied: 'Applied',
  screened: 'Screened',
  interview: 'Interview',
  technical: 'Technical',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
}

export const STAGE_COLORS: Record<CandidateStage, string> = {
  sourced: '#818cf8',
  applied: '#a78bfa',
  screened: '#c084fc',
  interview: '#e879f9',
  technical: '#f472b6',
  offer: '#34d399',
  hired: '#22d3ee',
  rejected: '#fb7185',
}
