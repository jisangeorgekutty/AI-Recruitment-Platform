import { create } from 'zustand'
import type { SubscriptionStatus, PaymentTransaction } from '@/services/payment.service'

interface SubscriptionState {
  subscription: SubscriptionStatus | null
  transactions: PaymentTransaction[]
  isCheckoutLoading: boolean

  setSubscription: (subscription: SubscriptionStatus | null) => void
  setTransactions: (transactions: PaymentTransaction[]) => void
  setCheckoutLoading: (isCheckoutLoading: boolean) => void
}

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  subscription: null,
  transactions: [],
  isCheckoutLoading: false,

  setSubscription: (subscription) => set({ subscription }),
  setTransactions: (transactions) => set({ transactions }),
  setCheckoutLoading: (isCheckoutLoading) => set({ isCheckoutLoading }),
}))
