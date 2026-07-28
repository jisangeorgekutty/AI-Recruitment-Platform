import api from './api'
import type {
  ApiResponse,
  Interview,
  InterviewAnswer,
  InterviewFeedback,
  InterviewQuestion,
  InterviewScorecard,
  PaginatedResponse,
  TableFilters,
} from '@/types'

function mapBackendSessionToInterview(item: Record<string, any> | null | undefined): Interview {
  if (!item) return {} as Interview

  const statusStr = (item.status || 'scheduled').toString().toLowerCase()
  const typeStr = (item.interviewType || item.type || 'ai_screening').toString()
  const schedAt = item.scheduledAt ? new Date(item.scheduledAt as string) : (item.date ? new Date(item.date as string) : new Date())
  const localDateStr = !isNaN(schedAt.getTime())
    ? `${schedAt.getFullYear()}-${String(schedAt.getMonth() + 1).padStart(2, '0')}-${String(schedAt.getDate()).padStart(2, '0')}`
    : (item.date ? String(item.date).split('T')[0] : new Date().toISOString().split('T')[0])

  return {
    id: String(item.id ?? ''),
    title: String(item.title || `AI Screening - ${item.jobTitle || 'Position'}`),
    candidateId: String(item.candidateProfileId || item.candidateId || ''),
    candidateName: String(item.candidateName || 'Candidate'),
    candidateAvatar: item.candidateAvatar ? String(item.candidateAvatar) : undefined,
    candidateEmail: String(item.candidateEmail || ''),
    jobId: String(item.jobPostingId || item.jobId || ''),
    jobTitle: String(item.jobTitle || 'Position'),
    companyName: String(item.companyName || 'Company'),
    type: (typeStr || 'ai_screening') as Interview['type'],
    status: (statusStr || 'scheduled') as Interview['status'],
    date: localDateStr,
    startTime: !isNaN(schedAt.getTime()) ? schedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (String(item.startTime || '10:00 AM')),
    endTime: !isNaN(schedAt.getTime()) ? new Date(schedAt.getTime() + (Number(item.durationMinutes) || 30) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (String(item.endTime || '10:30 AM')),
    duration: Number(item.durationMinutes || item.duration) || 30,
    interviewerIds: Array.isArray(item.interviewerIds) ? item.interviewerIds : ['usr-1'],
    interviewers: Array.isArray(item.interviewers) && item.interviewers.length > 0 ? item.interviewers : [{ id: 'usr-1', name: 'AI Interviewer' }],
    notes: String(item.notes || ''),
    questions: Array.isArray(item.questions) ? (item.questions as InterviewQuestion[]) : [],
    scorecard: item.scorecard ? (item.scorecard as InterviewScorecard) : undefined,
    createdAt: String(item.scheduledAt || item.createdAt || new Date().toISOString()),
    updatedAt: String(item.completedAt || item.updatedAt || new Date().toISOString()),
  }
}

export const interviewService = {
  async list(filters?: TableFilters & { page?: number; pageSize?: number; candidateId?: string; jobId?: string }): Promise<PaginatedResponse<Interview>> {
    try {
      const response = await api.get<ApiResponse<Record<string, any>>>('/interviews', { params: filters })
      const rawData = response.data?.data
      const rawItems = Array.isArray(rawData) ? rawData : (rawData?.items || rawData?.data || [])
      const items = rawItems.map((item: Record<string, any>) => mapBackendSessionToInterview(item))

      return {
        data: items,
        items,
        totalCount: items.length,
        total: items.length,
        page: 1,
        pageNumber: 1,
        pageSize: items.length || 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      } as PaginatedResponse<Interview>
    } catch {
      return {
        data: [],
        items: [],
        totalCount: 0,
        total: 0,
        page: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      } as PaginatedResponse<Interview>
    }
  },

  async getById(id: string): Promise<Interview | null> {
    try {
      const response = await api.get<ApiResponse<Record<string, any>>>(`/interviews/${id}`)
      if (response.data?.data) return mapBackendSessionToInterview(response.data.data)
    } catch {
      // Return null on failure
    }
    return null
  },

  async create(data: {
    jobApplicationId?: number
    title?: string
    interviewType?: string
    scheduledAt?: string
    durationMinutes?: number
    candidateName?: string
    jobTitle?: string
  }): Promise<Interview | null> {
    try {
      const payload = {
        jobApplicationId: Number(data.jobApplicationId) || 1,
        title: data.title,
        interviewType: data.interviewType || 'ai_screening',
        scheduledAt: data.scheduledAt || new Date().toISOString(),
        durationMinutes: data.durationMinutes || 30,
      }
      const response = await api.post<ApiResponse<Record<string, any>>>('/interviews', payload)
      if (response.data?.data) {
        return mapBackendSessionToInterview({
          ...response.data.data,
          candidateName: data.candidateName || response.data.data.candidateName,
          jobTitle: data.jobTitle || response.data.data.jobTitle,
        })
      }
    } catch {
      // Return null on failure
    }
    return null
  },

  async update(id: string, data: Partial<Interview>): Promise<Interview | null> {
    try {
      const response = await api.put<ApiResponse<Record<string, any>>>(`/interviews/${id}`, data)
      return response.data?.data ? mapBackendSessionToInterview(response.data.data) : null
    } catch {
      return null
    }
  },

  async cancel(id: string): Promise<Interview | null> {
    try {
      const response = await api.patch<ApiResponse<Record<string, any>>>(`/interviews/${id}/cancel`)
      return response.data?.data ? mapBackendSessionToInterview(response.data.data) : null
    } catch {
      return null
    }
  },

  async startSession(id: string): Promise<Interview | null> {
    try {
      const response = await api.post<ApiResponse<Record<string, any>>>(`/interviews/${id}/start`)
      return response.data?.data ? mapBackendSessionToInterview(response.data.data) : null
    } catch {
      return null
    }
  },

  async submitAnswer(sessionId: string, questionId: number | string, responseText: string, mediaUrl?: string): Promise<InterviewAnswer | null> {
    try {
      const response = await api.post<ApiResponse<InterviewAnswer>>(`/interviews/${sessionId}/answers`, {
        interviewQuestionId: Number(questionId) || questionId,
        candidateResponseText: responseText,
        mediaUrl,
      })
      return response.data?.data || null
    } catch {
      return null
    }
  },

  async getScorecard(sessionId: string): Promise<InterviewScorecard | null> {
    try {
      const response = await api.get<ApiResponse<InterviewScorecard>>(`/interviews/${sessionId}/scorecard`)
      return response.data?.data || null
    } catch {
      return null
    }
  },

  async generateScorecard(sessionId: string): Promise<InterviewScorecard | null> {
    try {
      const response = await api.post<ApiResponse<InterviewScorecard>>(`/interviews/${sessionId}/generate-scorecard`)
      return response.data?.data || null
    } catch {
      return null
    }
  },

  async submitFeedback(id: string, feedback?: InterviewFeedback): Promise<Interview | null> {
    try {
      const response = await api.post<ApiResponse<Record<string, any>>>(`/interviews/${id}/feedback`, feedback)
      return response.data?.data ? mapBackendSessionToInterview(response.data.data) : null
    } catch {
      return null
    }
  },

  async getUpcoming(): Promise<Interview[]> {
    try {
      const response = await api.get<ApiResponse<Record<string, any>>>('/interviews')
      const rawData = response.data?.data
      const rawItems = Array.isArray(rawData) ? rawData : (rawData?.items || rawData?.data || [])
      const items = rawItems.map((item: Record<string, any>) => mapBackendSessionToInterview(item))
      return items.filter((i: Interview) => i.status === 'scheduled' || i.status === 'confirmed' || i.status === 'in_progress')
    } catch {
      return []
    }
  },

  async getCalendar(dateFrom: string, dateTo: string): Promise<Interview[]> {
    try {
      const response = await api.get<ApiResponse<Record<string, any>>>('/interviews', { params: { dateFrom, dateTo } })
      const rawData = response.data?.data
      const rawItems = Array.isArray(rawData) ? rawData : (rawData?.items || rawData?.data || [])
      return rawItems.map((item: Record<string, any>) => mapBackendSessionToInterview(item))
    } catch {
      return []
    }
  },
}
