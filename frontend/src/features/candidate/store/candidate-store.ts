import { create } from 'zustand'
import type { Application, SavedJob, CandidateOffer } from '@/features/candidate/types'

interface CandidateStoreState {
  applications: Application[]
  savedJobs: SavedJob[]
  offers: CandidateOffer[]
  resumeUrl: string | null
  profileCompletion: number
  aiResumeScore: number | null

  setApplications: (apps: Application[]) => void
  setSavedJobs: (jobs: SavedJob[]) => void
  setOffers: (offers: CandidateOffer[]) => void
  setResumeUrl: (url: string | null) => void
  setProfileCompletion: (pct: number) => void
  setAiResumeScore: (score: number | null) => void
}

export const useCandidateStore = create<CandidateStoreState>()((set) => ({
  applications: [],
  savedJobs: [],
  offers: [],
  resumeUrl: null,
  profileCompletion: 65,
  aiResumeScore: null,

  setApplications: (applications) => set({ applications }),
  setSavedJobs: (savedJobs) => set({ savedJobs }),
  setOffers: (offers) => set({ offers }),
  setResumeUrl: (url) => set({ resumeUrl: url }),
  setProfileCompletion: (pct) => set({ profileCompletion: pct }),
  setAiResumeScore: (score) => set({ aiResumeScore: score }),
}))
