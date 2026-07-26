import api from './api'
import type { ApiResponse, ResumeAtsAnalysis } from '@/types'

export interface CandidateResumeResponse {
  id: number
  candidateProfileId: number
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  isPrimary: boolean
  createdOn: string
}

export const resumeService = {
  async uploadResume(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    formData.append('isPrimary', 'true')
    const response = await api.post<ApiResponse<CandidateResumeResponse>>('/candidate-resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async analyzeAts(resumeId: number | string) {
    const response = await api.post<ApiResponse<ResumeAtsAnalysis>>(`/candidate-resumes/${resumeId}/analyze-ats`)
    return response.data.data
  },

  async getAtsAnalysis(resumeId: number | string) {
    const response = await api.get<ApiResponse<ResumeAtsAnalysis>>(`/candidate-resumes/${resumeId}/ats-analysis`)
    return response.data.data
  },

  async getMyResumes() {
    const response = await api.get<ApiResponse<CandidateResumeResponse[]>>('/candidate-resumes')
    return response.data.data
  },

  async delete(resumeId: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/candidate-resumes/${resumeId}`)
    return response.data.data
  },
}


