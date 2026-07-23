import { create } from 'zustand'
import type { Interview, TableFilters } from '@/types'

interface InterviewState {
  interviews: Interview[]
  total: number
  currentPage: number
  pageSize: number
  filters: TableFilters
  upcomingInterviews: Interview[]
  selectedInterview: Interview | null
  isLoading: boolean

  setInterviews: (interviews: Interview[]) => void
  setTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: Partial<TableFilters>) => void
  setUpcoming: (interviews: Interview[]) => void
  setSelectedInterview: (interview: Interview | null) => void
  setLoading: (isLoading: boolean) => void
  addInterview: (interview: Interview) => void
  updateInterview: (id: string, data: Partial<Interview>) => void
  removeInterview: (id: string) => void
}

const defaultFilters: TableFilters = {
  search: '',
  status: '',
  sortBy: 'date',
  sortOrder: 'asc',
}

export const useInterviewStore = create<InterviewState>()((set) => ({
  interviews: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: defaultFilters,
  upcomingInterviews: [],
  selectedInterview: null,
  isLoading: false,

  setInterviews: (interviews) => set({ interviews }),
  setTotal: (total) => set({ total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters }, currentPage: 1 })),
  setUpcoming: (interviews) => set({ upcomingInterviews: interviews }),
  setSelectedInterview: (interview) => set({ selectedInterview: interview }),
  setLoading: (isLoading) => set({ isLoading }),

  addInterview: (interview) =>
    set((state) => ({
      interviews: [...state.interviews, interview],
      total: state.total + 1,
    })),

  updateInterview: (id, data) =>
    set((state) => ({
      interviews: state.interviews.map((i) => (i.id === id ? { ...i, ...data } : i)),
      selectedInterview:
        state.selectedInterview?.id === id
          ? { ...state.selectedInterview, ...data }
          : state.selectedInterview,
    })),

  removeInterview: (id) =>
    set((state) => ({
      interviews: state.interviews.filter((i) => i.id !== id),
      total: state.total - 1,
    })),
}))
