import { create } from 'zustand'
import type { Candidate, TableFilters } from '@/types'

interface CandidateState {
  candidates: Candidate[]
  total: number
  currentPage: number
  pageSize: number
  filters: TableFilters
  selectedCandidates: string[]
  comparisonCandidates: string[]
  selectedJobId: string | null

  setCandidates: (candidates: Candidate[]) => void
  setTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: Partial<TableFilters>) => void
  resetFilters: () => void
  setSelectedCandidates: (ids: string[]) => void
  toggleCandidateSelection: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setPipeline: (pipeline: Record<string, Candidate[]>) => void
  updateCandidate: (id: string, data: Partial<Candidate>) => void
  removeCandidate: (id: string) => void
  toggleComparisonSelection: (id: string) => void
  clearComparison: () => void
  setSelectedJobId: (jobId: string | null) => void
}

const defaultFilters: TableFilters = {
  search: '',
  status: '',
  stage: '',
  sortBy: 'appliedDate',
  sortOrder: 'desc',
}

export const useCandidateStore = create<CandidateState>()((set) => ({
  candidates: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: defaultFilters,
  selectedCandidates: [],
  comparisonCandidates: [],
  selectedJobId: null,
  pipeline: {},
  isLoading: false,

  setCandidates: (candidates) => set({ candidates }),
  setTotal: (total) => set({ total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1,
    })),

  resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),

  setSelectedCandidates: (ids) => set({ selectedCandidates: ids }),

  toggleCandidateSelection: (id) =>
    set((state) => ({
      selectedCandidates: state.selectedCandidates.includes(id)
        ? state.selectedCandidates.filter((cId) => cId !== id)
        : [...state.selectedCandidates, id],
    })),

  toggleComparisonSelection: (id) =>
    set((state) => {
      const exists = state.comparisonCandidates.includes(id)
      if (exists) {
        return { comparisonCandidates: state.comparisonCandidates.filter((cId) => cId !== id) }
      }
      if (state.comparisonCandidates.length >= 4) {
        return state // Max 4 candidates
      }
      return { comparisonCandidates: [...state.comparisonCandidates, id] }
    }),

  clearComparison: () => set({ comparisonCandidates: [] }),

  setSelectedJobId: (jobId) => set({ selectedJobId: jobId }),

  setLoading: (isLoading) => set({ isLoading }),

  setPipeline: (pipeline) => set({ pipeline }),

  updateCandidate: (id, data) =>
    set((state) => ({
      candidates: state.candidates.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),

  removeCandidate: (id) =>
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== id),
      total: state.total - 1,
      selectedCandidates: state.selectedCandidates.filter((cId) => cId !== id),
      comparisonCandidates: state.comparisonCandidates.filter((cId) => cId !== id),
    })),
}))
