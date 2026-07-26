import api from './api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface RecruiterParsedResumeItem {
  id: number
  companyProfileId: number
  recruiterUserId: number
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  currentTitle?: string
  location?: string
  yearsOfExperience: number
  summary?: string
  skills: string[]
  atsOverallScore: number
  atsKeywordScore: number
  atsFormatScore: number
  atsCompletenessScore: number
  atsSuggestions: string[]
  originalFileName: string
  documentUrl?: string
  parsedAt: string
}

export const recruiterTalentService = {
  async uploadAndParse(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<ApiResponse<RecruiterParsedResumeItem>>('/recruiter/talent-pool/parse-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async getTalentPool(search?: string, page = 1, pageSize = 20) {
    const response = await api.get<ApiResponse<PaginatedResponse<RecruiterParsedResumeItem>>>('/recruiter/talent-pool', {
      params: { search, page, pageSize },
    })
    return response.data.data
  },

  async getById(id: number | string) {
    const response = await api.get<ApiResponse<RecruiterParsedResumeItem>>(`/recruiter/talent-pool/${id}`)
    return response.data.data
  },

  async delete(id: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/recruiter/talent-pool/${id}`)
    return response.data.data
  },
}
