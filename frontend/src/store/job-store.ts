import { create } from 'zustand'
import type { Job, TableFilters } from '@/types'

interface JobState {
  jobs: Job[]
  total: number
  currentPage: number
  pageSize: number
  filters: TableFilters
  selectedJobs: string[]
  isLoading: boolean

  setJobs: (jobs: Job[]) => void
  setTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: Partial<TableFilters>) => void
  resetFilters: () => void
  setSelectedJobs: (ids: string[]) => void
  toggleJobSelection: (id: string) => void
  selectAll: () => void
  clearSelection: () => void
  setLoading: (isLoading: boolean) => void
  addJob: (job: Job) => void
  updateJob: (id: string, data: Partial<Job>) => void
  removeJob: (id: string) => void
}

const defaultFilters: TableFilters = {
  search: '',
  status: '',
  sortBy: 'createdAt',
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
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...data } : j)),
    })),

  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
      total: state.total - 1,
      selectedJobs: state.selectedJobs.filter((jId) => jId !== id),
    })),
}))
