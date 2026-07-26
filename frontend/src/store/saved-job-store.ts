import { create } from 'zustand'
import type { CandidateSavedJob } from '@/services/saved-job.service'

interface SavedJobState {
  savedJobs: CandidateSavedJob[]
  isLoading: boolean
  setSavedJobs: (savedJobs: CandidateSavedJob[]) => void
  setLoading: (isLoading: boolean) => void
  removeSavedJob: (jobId: number) => void
}

export const useSavedJobStore = create<SavedJobState>()((set) => ({
  savedJobs: [],
  isLoading: false,
  setSavedJobs: (savedJobs) => set({ savedJobs }),
  setLoading: (isLoading) => set({ isLoading }),
  removeSavedJob: (jobId) =>
    set((state) => ({
      savedJobs: state.savedJobs.filter((sj) => sj.jobPostingId !== jobId),
    })),
}))
