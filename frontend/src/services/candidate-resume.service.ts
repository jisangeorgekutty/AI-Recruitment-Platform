import api from './api'
import type { ApiResponse } from '@/types'

export interface CandidateResumeItem {
  id: number
  candidateProfileId: number
  fileName: string
  fileUrl: string
  publicId?: string
  fileType: string
  fileSize: number
  isPrimary: boolean
  uploadedAt: string
}

export interface ResumeAtsSuggestion {
  text: string
  type: 'improvement' | 'warning' | 'suggestion' | 'success' | string
}

export interface ResumeAtsAnalysis {
  id: number
  candidateResumeId: number
  candidateProfileId: number
  overallScore: number
  keywordMatchScore: number
  formatCompatibilityScore: number
  sectionCompletenessScore: number
  suggestions: ResumeAtsSuggestion[]
  analyzedAt: string
}

export const candidateResumeService = {
  async getMyResumes() {
    const response = await api.get<ApiResponse<CandidateResumeItem[]>>('/candidate-resumes')
    return response.data.data
  },

  async uploadResume(file: File, isPrimary: boolean = false) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('isPrimary', String(isPrimary))

    const response = await api.post<ApiResponse<CandidateResumeItem>>('/candidate-resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async setPrimary(id: number | string) {
    const response = await api.post<ApiResponse<boolean>>(`/candidate-resumes/${id}/primary`)
    return response.data.data
  },

  async deleteResume(id: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/candidate-resumes/${id}`)
    return response.data.data
  },

  async analyzeAts(id: number | string) {
    const response = await api.post<ApiResponse<ResumeAtsAnalysis>>(`/candidate-resumes/${id}/analyze-ats`)
    return response.data.data
  },

  async getAtsAnalysis(id: number | string) {
    const response = await api.get<ApiResponse<ResumeAtsAnalysis>>(`/candidate-resumes/${id}/ats-analysis`)
    return response.data.data
  },
}
