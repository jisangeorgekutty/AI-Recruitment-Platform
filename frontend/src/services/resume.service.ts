import api from './api'
import type { ApiResponse, Resume, ParsedResume, ResumeScore } from '@/types'

export const resumeService = {
  async upload(candidateId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('candidateId', candidateId)
    const response = await api.post<ApiResponse<Resume>>('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async parse(resumeId: string) {
    const response = await api.post<ApiResponse<ParsedResume>>(`/resume/${resumeId}/parse`)
    return response.data.data
  },

  async analyze(resumeId: string, jobId: string) {
    const response = await api.post<ApiResponse<ResumeScore>>(`/resume/${resumeId}/analyze`, { jobId })
    return response.data.data
  },

  async getByCandidate(candidateId: string) {
    const response = await api.get<ApiResponse<Resume[]>>(`/resume/candidate/${candidateId}`)
    return response.data.data
  },

  async delete(resumeId: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/resume/${resumeId}`)
    return response.data.data
  },
}
