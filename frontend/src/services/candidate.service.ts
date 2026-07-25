import api from './api'
import type { ApiResponse, Candidate, PaginatedResponse, TableFilters } from '@/types'

export interface CandidateExperienceItem {
  id: number
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
}

export interface CandidateEducationItem {
  id: number
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  grade?: string
  description?: string
}

export interface CandidateSkillItem {
  id: number
  name: string
  proficiency?: string
}

export interface CandidateLanguageItem {
  id: number
  name: string
  proficiency?: string
}

export interface CandidateSocialLinks {
  gitHubUrl?: string
  linkedInUrl?: string
  portfolioUrl?: string
  websiteUrl?: string
}

export interface CandidateProfile {
  profileInformationId: number
  userId: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  avatarUrl?: string
  currentTitle?: string
  summary?: string
  location?: string
  yearsOfExperience: number
  resumeUrl?: string
  socialLinks: CandidateSocialLinks
  experiences: CandidateExperienceItem[]
  educations: CandidateEducationItem[]
  skills: CandidateSkillItem[]
  languages: CandidateLanguageItem[]
}

export interface UpdatePersonalInfoPayload {
  firstName?: string
  lastName?: string
  phone?: string
  currentTitle?: string
  location?: string
  summary?: string
  yearsOfExperience?: number
}

export interface UpdateSocialLinksPayload {
  gitHubUrl?: string
  linkedInUrl?: string
  portfolioUrl?: string
  websiteUrl?: string
}

export const candidateService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number; jobId?: string }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Candidate>>>('/candidates', { params: filters })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`)
    return response.data.data
  },

  async create(data: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post<ApiResponse<Candidate>>('/candidates', data)
    return response.data.data
  },

  async update(id: string, data: Partial<Candidate>) {
    const response = await api.put<ApiResponse<Candidate>>(`/candidates/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidates/${id}`)
    return response.data.data
  },

  async updateStage(id: string, stage: Candidate['stage']) {
    const response = await api.patch<ApiResponse<Candidate>>(`/candidates/${id}/stage`, { stage })
    return response.data.data
  },

  async addNote(id: string, note: string) {
    const response = await api.post<ApiResponse<Candidate>>(`/candidates/${id}/notes`, { note })
    return response.data.data
  },

  async getPipeline(jobId?: string) {
    const response = await api.get<ApiResponse<Record<string, Candidate[]>>>('/candidates/pipeline', { params: { jobId } })
    return response.data.data
  },

  // Candidate Profile Endpoints
  async getMyProfile() {
    const response = await api.get<ApiResponse<CandidateProfile>>('/candidate/profile')
    return response.data.data
  },

  async getProfileById(id: number) {
    const response = await api.get<ApiResponse<CandidateProfile>>(`/candidate/profile/${id}`)
    return response.data.data
  },

  async updatePersonalInfo(data: UpdatePersonalInfoPayload) {
    const response = await api.put<ApiResponse<CandidateProfile>>('/candidate/profile/personal', data)
    return response.data.data
  },

  async updateSocialLinks(data: UpdateSocialLinksPayload) {
    const response = await api.put<ApiResponse<CandidateProfile>>('/candidate/profile/social-links', data)
    return response.data.data
  },

  async addExperience(data: Omit<CandidateExperienceItem, 'id'>) {
    const response = await api.post<ApiResponse<CandidateExperienceItem>>('/candidate/profile/experiences', data)
    return response.data.data
  },

  async updateExperience(id: number, data: Partial<CandidateExperienceItem>) {
    const response = await api.put<ApiResponse<CandidateExperienceItem>>(`/candidate/profile/experiences/${id}`, data)
    return response.data.data
  },

  async deleteExperience(id: number) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidate/profile/experiences/${id}`)
    return response.data.data
  },

  async addEducation(data: Omit<CandidateEducationItem, 'id'>) {
    const response = await api.post<ApiResponse<CandidateEducationItem>>('/candidate/profile/educations', data)
    return response.data.data
  },

  async updateEducation(id: number, data: Partial<CandidateEducationItem>) {
    const response = await api.put<ApiResponse<CandidateEducationItem>>(`/candidate/profile/educations/${id}`, data)
    return response.data.data
  },

  async deleteEducation(id: number) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidate/profile/educations/${id}`)
    return response.data.data
  },

  async addSkill(data: { name: string; proficiency?: string }) {
    const response = await api.post<ApiResponse<CandidateSkillItem>>('/candidate/profile/skills', data)
    return response.data.data
  },

  async deleteSkill(id: number) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidate/profile/skills/${id}`)
    return response.data.data
  },

  async addLanguage(data: { name: string; proficiency?: string }) {
    const response = await api.post<ApiResponse<CandidateLanguageItem>>('/candidate/profile/languages', data)
    return response.data.data
  },

  async deleteLanguage(id: number) {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/candidate/profile/languages/${id}`)
    return response.data.data
  },

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<ApiResponse<string>>('/candidate/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  async uploadResume(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<ApiResponse<string>>('/candidate/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },
}
