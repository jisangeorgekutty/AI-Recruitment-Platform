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
}
