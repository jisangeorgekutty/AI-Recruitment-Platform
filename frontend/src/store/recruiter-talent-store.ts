import { create } from 'zustand'
import type { RecruiterParsedResumeItem } from '@/services/recruiter-talent.service'

interface RecruiterTalentState {
  activeTalent: RecruiterParsedResumeItem | null
  searchQuery: string
  setActiveTalent: (talent: RecruiterParsedResumeItem | null) => void
  setSearchQuery: (query: string) => void
}

export const useRecruiterTalentStore = create<RecruiterTalentState>((set) => ({
  activeTalent: null,
  searchQuery: '',
  setActiveTalent: (talent) => set({ activeTalent: talent }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
