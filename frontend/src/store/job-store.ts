import { create } from 'zustand'
import type { Job, JobSkill, JobScreeningQuestion, TableFilters } from '@/types'

export interface JobWizardData {
  title: string
  department: string
  location: string
  remoteType: 'OnSite' | 'Remote' | 'Hybrid'
  employmentType: 'FullTime' | 'PartTime' | 'Contract' | 'Internship'
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'
  description: string
  requirements: string
  responsibilities: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  showSalary: boolean
  hiringManager?: string
  skills: JobSkill[]
  screeningQuestions: JobScreeningQuestion[]
}

const defaultWizardData: JobWizardData = {
  title: '',
  department: '',
  location: '',
  remoteType: 'OnSite',
  employmentType: 'FullTime',
  experienceLevel: 'Mid',
  description: '',
  requirements: '',
  responsibilities: '',
  salaryMin: 50000,
  salaryMax: 120000,
  currency: 'USD',
  showSalary: true,
  hiringManager: '',
  skills: [],
  screeningQuestions: [],
}

interface JobState {
  jobs: Job[]
  total: number
  currentPage: number
  pageSize: number
  filters: TableFilters
  selectedJobs: (string | number)[]
  isLoading: boolean
  
  // Wizard State
  activeWizardStep: number
  wizardDraft: JobWizardData

  setJobs: (jobs: Job[]) => void
  setTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: Partial<TableFilters>) => void
  resetFilters: () => void
  setSelectedJobs: (ids: (string | number)[]) => void
  toggleJobSelection: (id: string | number) => void
  selectAll: () => void
  clearSelection: () => void
  setLoading: (isLoading: boolean) => void
  addJob: (job: Job) => void
  updateJob: (id: string | number, data: Partial<Job>) => void
  removeJob: (id: string | number) => void

  // Wizard actions
  setActiveWizardStep: (step: number) => void
  setWizardDraft: (data: Partial<JobWizardData>) => void
  resetWizardDraft: () => void
}

const defaultFilters: TableFilters = {
  search: '',
  status: '',
  sortBy: 'createdOn',
  sortOrder: 'desc',
}

export const useJobStore = create<JobState>()((set) => ({
  jobs: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: defaultFilters,
  selectedJobs: [],
  isLoading: false,

  activeWizardStep: 1,
  wizardDraft: defaultWizardData,

  setJobs: (jobs) => set({ jobs }),
  setTotal: (total) => set({ total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1,
    })),

  resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),

  setSelectedJobs: (ids) => set({ selectedJobs: ids }),

  toggleJobSelection: (id) =>
    set((state) => ({
      selectedJobs: state.selectedJobs.includes(id)
        ? state.selectedJobs.filter((jobId) => jobId !== id)
        : [...state.selectedJobs, id],
    })),

  selectAll: () =>
    set((state) => ({
      selectedJobs: state.jobs.map((j) => j.id),
    })),

  clearSelection: () => set({ selectedJobs: [] }),
  setLoading: (isLoading) => set({ isLoading }),

  addJob: (job) =>
    set((state) => ({
      jobs: [job, ...state.jobs],
      total: state.total + 1,
    })),

  updateJob: (id, data) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (String(j.id) === String(id) ? { ...j, ...data } : j)),
    })),

  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((j) => String(j.id) !== String(id)),
      total: state.total - 1,
      selectedJobs: state.selectedJobs.filter((jId) => String(jId) !== String(id)),
    })),

  setActiveWizardStep: (step) => set({ activeWizardStep: step }),

  setWizardDraft: (data) =>
    set((state) => ({
      wizardDraft: { ...state.wizardDraft, ...data },
    })),

  resetWizardDraft: () =>
    set({
      activeWizardStep: 1,
      wizardDraft: defaultWizardData,
    }),
}))
