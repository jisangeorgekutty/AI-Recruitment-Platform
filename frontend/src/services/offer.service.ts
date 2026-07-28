import api from './api'
import type { ApiResponse } from '@/types'

export interface JobOffer {
  id: number
  jobApplicationId: number
  jobPostingId: number
  jobTitle: string
  companyName: string
  companyLogoUrl?: string
  location: string
  offeredSalary: number
  currency: string
  salaryPeriod: string
  proposedStartDate?: string
  offeredDate: string
  expiresAt: string
  status: 'Pending' | 'Accepted' | 'Declined' | 'Expired'
  recruiterNotes?: string
  respondedDate?: string
}

export interface SendOfferPayload {
  applicationId: number
  offeredSalary?: number
  currency?: string
  salaryPeriod?: string
  proposedStartDate?: string
  expiresInDays?: number
  recruiterNotes?: string
}

export const offerService = {
  async getMyOffers() {
    const response = await api.get<ApiResponse<JobOffer[]>>('/offers/my-offers')
    return response.data.data
  },

  async getOfferByApplicationId(applicationId: number | string) {
    const response = await api.get<ApiResponse<JobOffer>>(`/offers/application/${applicationId}`)
    return response.data.data
  },

  async sendOffer(payload: SendOfferPayload) {
    const response = await api.post<ApiResponse<JobOffer>>('/offers', payload)
    return response.data.data
  },

  async respondToOffer(applicationId: number | string, responseText: 'Accepted' | 'Declined') {
    const response = await api.patch<ApiResponse<boolean>>(`/offers/${applicationId}/respond`, { response: responseText })
    return response.data.data
  },
}
