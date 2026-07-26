import { create } from 'zustand'
import type { JobMatchResult } from '@/types'

interface JobMatchState {
  selectedApplicationId: number | null
  isMatchModalOpen: boolean
  activeMatchResult: JobMatchResult | null
  sortByAiScore: boolean
  
  openMatchModal: (applicationId: number, matchResult?: JobMatchResult | null) => void
  closeMatchModal: () => void
  setActiveMatchResult: (matchResult: JobMatchResult | null) => void
  toggleSortByAiScore: () => void
  setSortByAiScore: (enabled: boolean) => void
}

export const useJobMatchStore = create<JobMatchState>((set) => ({
  selectedApplicationId: null,
  isMatchModalOpen: false,
  activeMatchResult: null,
  sortByAiScore: false,

  openMatchModal: (applicationId, matchResult = null) =>
    set({
      selectedApplicationId: applicationId,
      activeMatchResult: matchResult,
      isMatchModalOpen: true,
    }),

  closeMatchModal: () =>
    set({
      selectedApplicationId: null,
      activeMatchResult: null,
      isMatchModalOpen: false,
    }),

  setActiveMatchResult: (matchResult) => set({ activeMatchResult: matchResult }),

  toggleSortByAiScore: () => set((state) => ({ sortByAiScore: !state.sortByAiScore })),

  setSortByAiScore: (enabled) => set({ sortByAiScore: enabled }),
}))
