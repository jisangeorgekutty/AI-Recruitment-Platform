import api from './api'
import type { ApiResponse, Company } from '@/types'

const MOCK_COMPANY: Company = {
  id: 'comp-1',
  companyName: 'Acme AI Technologies',
  name: 'Acme AI Technologies',
  industry: 'Technology & Software',
  size: '100-500',
  description: 'Building next-generation artificial intelligence platforms and scalable cloud systems.',
  website: 'https://acme-ai.example.com',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
  location: 'San Francisco, CA',
  establishedYear: 2021,
  foundedYear: 2021,
  socialLinks: {
    linkedin: 'https://linkedin.com/company/acme-ai',
    twitter: 'https://twitter.com/acme_ai',
  },
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2026-07-20T00:00:00Z',
}

export const companyService = {
  async getProfile() {
    try {
      const response = await api.get<ApiResponse<Company>>('/company')
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_COMPANY
  },

  async updateProfile(data: Partial<Company>) {
    try {
      const response = await api.put<ApiResponse<Company>>('/company', data)
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return { ...MOCK_COMPANY, ...data }
  },

  async uploadLogo(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('logoFile', file)
      const response = await api.post<ApiResponse<string>>('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.data?.data) return response.data.data
    } catch {
      // Fallback
    }
    return MOCK_COMPANY.logo || ''
  },
}

