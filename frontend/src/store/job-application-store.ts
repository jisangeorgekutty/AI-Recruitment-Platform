import { create } from 'zustand'
import type { JobApplication } from '@/services/job-application.service'

interface JobApplicationState {
  applications: JobApplication[]
  selectedApplication: JobApplication | null
  isLoading: boolean
  setApplications: (applications: JobApplication[]) => void
  setSelectedApplication: (application: JobApplication | null) => void
  setLoading: (isLoading: boolean) => void
  addApplication: (application: JobApplication) => void
  updateApplicationStatus: (id: number, status: string) => void
}

export const useJobApplicationStore = create<JobApplicationState>()((set) => ({
  applications: [],
  selectedApplication: null,
  isLoading: false,
  setApplications: (applications) => set({ applications }),
  setSelectedApplication: (application) => set({ selectedApplication: application }),
  setLoading: (isLoading) => set({ isLoading }),
  addApplication: (application) =>
    set((state) => ({ applications: [application, ...state.applications] })),
  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    })),
}))
