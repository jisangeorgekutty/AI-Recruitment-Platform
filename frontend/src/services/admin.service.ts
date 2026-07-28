import api from './api'
import type { ApiResponse } from '@/types'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  plan: string
  status: string
  jobsCount: number
  joined: string
  createdOn: string
}

export interface AdminCompany {
  id: number
  name: string
  email: string
  industry: string
  plan: string
  status: string
  employees: string
  activeJobsCount: number
  createdOn: string
}

export interface SubscriptionPlan {
  id: number
  name: string
  price: number
  billingCycle: string
  maxUsers: number
  maxJobs: number
  features: string[]
  subscribersCount: number
  badgeColor: string
  displayOrder: number
}

export interface AuditLog {
  id: number
  userId?: number
  userEmail: string
  action: string
  target: string
  severity: 'info' | 'medium' | 'high' | 'critical'
  details?: string
  ipAddress?: string
  createdOn: string
}

export interface AdminDashboardStats {
  totalUsers: number
  activeCandidates: number
  activeRecruiters: number
  totalCompanies: number
  pendingCompanyVerifications: number
  totalActiveJobs: number
  totalApplications: number
  totalMonthlyRevenue: number
}

export const adminService = {
  async getDashboardStats() {
    const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard')
    return response.data.data
  },

  async getUsers(params?: { search?: string; role?: string; status?: string }) {
    const response = await api.get<ApiResponse<AdminUser[]>>('/admin/users', { params })
    return response.data.data
  },

  async updateUserStatus(id: number, status: string) {
    const response = await api.patch<ApiResponse<boolean>>(`/admin/users/${id}/status`, { status })
    return response.data.data
  },

  async updateUserRole(id: number, role: string) {
    const response = await api.patch<ApiResponse<boolean>>(`/admin/users/${id}/role`, { role })
    return response.data.data
  },

  async getCompanies(params?: { search?: string; status?: string }) {
    const response = await api.get<ApiResponse<AdminCompany[]>>('/admin/companies', { params })
    return response.data.data
  },

  async updateCompanyStatus(id: number, status: string) {
    const response = await api.patch<ApiResponse<boolean>>(`/admin/companies/${id}/status`, { status })
    return response.data.data
  },

  async getPlans() {
    const response = await api.get<ApiResponse<SubscriptionPlan[]>>('/admin/plans')
    return response.data.data
  },

  async createPlan(data: Partial<SubscriptionPlan>) {
    const response = await api.post<ApiResponse<SubscriptionPlan>>('/admin/plans', data)
    return response.data.data
  },

  async updatePlan(id: number, data: Partial<SubscriptionPlan>) {
    const response = await api.put<ApiResponse<SubscriptionPlan>>(`/admin/plans/${id}`, data)
    return response.data.data
  },

  async deletePlan(id: number) {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/plans/${id}`)
    return response.data.data
  },

  async getAuditLogs(params?: { search?: string; severity?: string; page?: number; pageSize?: number }) {
    const response = await api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', { params })
    return response.data.data
  },
}
