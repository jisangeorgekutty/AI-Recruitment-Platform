import api from './api'
import type { ApiResponse } from '@/types'

export interface JobApplicationAnswer {
  jobScreeningQuestionId: number
  answerText: string
  questionText?: string
}

export interface JobApplication {
  id: number
  jobPostingId: number
  jobTitle: string
  companyName: string
  companyLogoUrl?: string
  location: string
  candidateProfileId: number
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  candidateResumeId?: number
  resumeUrl?: string
  coverLetter?: string
  status: string
  appliedDate: string
  answers: JobApplicationAnswer[]
}

export const jobApplicationService = {
  async apply(formData: FormData) {
    const response = await api.post<ApiResponse<JobApplication>>('/jobapplications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async getMyApplications() {
    const response = await api.get<ApiResponse<JobApplication[]>>('/jobapplications/my-applications')
    return response.data.data
  },

  async getApplicationById(id: number | string) {
    const response = await api.get<ApiResponse<JobApplication>>(`/jobapplications/${id}`)
    return response.data.data
  },

  async withdrawApplication(id: number | string) {
    const response = await api.delete<ApiResponse<boolean>>(`/jobapplications/${id}/withdraw`)
    return response.data.data
  },

  async getApplicationsForJob(jobId: number | string) {
    const response = await api.get<ApiResponse<JobApplication[]>>(`/jobapplications/job/${jobId}`)
    return response.data.data
  },

  async updateStatus(id: number | string, status: string) {
    const response = await api.patch<ApiResponse<boolean>>(`/jobapplications/${id}/status`, { status })
    return response.data.data
  },
}
