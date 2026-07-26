import { create } from 'zustand'
import type { Resume, ParsedResume, ResumeScore } from '@/types'
import type { ResumeAtsAnalysis } from '@/services/candidate-resume.service'

interface ResumeState {
  resumes: Resume[]
  currentResume: Resume | null
  parsedData: ParsedResume | null
  resumeScore: ResumeScore | null
  atsAnalysis: ResumeAtsAnalysis | null
  isUploading: boolean
  isParsing: boolean
  isAnalyzing: boolean

  setResumes: (resumes: Resume[]) => void
  setCurrentResume: (resume: Resume | null) => void
  setParsedData: (data: ParsedResume | null) => void
  setResumeScore: (score: ResumeScore | null) => void
  setAtsAnalysis: (analysis: ResumeAtsAnalysis | null) => void
  setUploading: (isUploading: boolean) => void
  setParsing: (isParsing: boolean) => void
  setAnalyzing: (isAnalyzing: boolean) => void
  addResume: (resume: Resume) => void
  removeResume: (id: string) => void
}

export const useResumeStore = create<ResumeState>()((set) => ({
  resumes: [],
  currentResume: null,
  parsedData: null,
  resumeScore: null,
  atsAnalysis: null,
  isUploading: false,
  isParsing: false,
  isAnalyzing: false,

  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setParsedData: (data) => set({ parsedData: data }),
  setResumeScore: (score) => set({ resumeScore: score }),
  setAtsAnalysis: (analysis) => set({ atsAnalysis: analysis }),
  setUploading: (isUploading) => set({ isUploading }),
  setParsing: (isParsing) => set({ isParsing }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  addResume: (resume) =>
    set((state) => ({
      resumes: [...state.resumes, resume],
    })),

  removeResume: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
      currentResume: state.currentResume?.id === id ? null : state.currentResume,
    })),
}))
