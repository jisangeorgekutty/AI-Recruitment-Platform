import { create } from 'zustand'
import type { AdminUser, AdminCompany, SubscriptionPlan, AuditLog, AdminDashboardStats } from '@/services/admin.service'

interface AdminState {
  users: AdminUser[]
  companies: AdminCompany[]
  plans: SubscriptionPlan[]
  auditLogs: AuditLog[]
  dashboardStats: AdminDashboardStats | null
  isLoading: boolean
  setUsers: (users: AdminUser[]) => void
  setCompanies: (companies: AdminCompany[]) => void
  setPlans: (plans: SubscriptionPlan[]) => void
  setAuditLogs: (logs: AuditLog[]) => void
  setDashboardStats: (stats: AdminDashboardStats | null) => void
  updateUserStatus: (id: number, status: string) => void
  updateCompanyStatus: (id: number, status: string) => void
  setLoading: (isLoading: boolean) => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  users: [],
  companies: [],
  plans: [],
  auditLogs: [],
  dashboardStats: null,
  isLoading: false,

  setUsers: (users) => set({ users }),
  setCompanies: (companies) => set({ companies }),
  setPlans: (plans) => set({ plans }),
  setAuditLogs: (auditLogs) => set({ auditLogs }),
  setDashboardStats: (dashboardStats) => set({ dashboardStats }),

  updateUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
    })),

  updateCompanyStatus: (id, status) =>
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, status } : c)),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}))
