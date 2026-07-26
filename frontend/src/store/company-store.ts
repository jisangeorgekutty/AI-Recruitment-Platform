import { create } from 'zustand'
import type { Company } from '@/types'

interface CompanyState {
  company: Company | null
  logoUrl: string
  isLoading: boolean

  setCompany: (company: Company | null) => void
  updateCompanyState: (data: Partial<Company>) => void
  setLogoUrl: (url: string) => void
  setLoading: (isLoading: boolean) => void
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  company: null,
  logoUrl: localStorage.getItem('company_logo') || '',
  isLoading: false,

  setCompany: (company) =>
    set({
      company,
      logoUrl: company?.companyLogoUrl || company?.logo || localStorage.getItem('company_logo') || '',
    }),

  updateCompanyState: (data) =>
    set((state) => ({
      company: state.company ? { ...state.company, ...data } : (data as Company),
      logoUrl: data.companyLogoUrl || data.logo || state.logoUrl,
    })),

  setLogoUrl: (url) => {
    localStorage.setItem('company_logo', url)
    set({ logoUrl: url })
  },

  setLoading: (isLoading) => set({ isLoading }),
}))
