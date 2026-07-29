import api from './api'
import type { ApiResponse } from '@/types'

export interface CheckoutSessionRequest {
  planId: number
  successUrl?: string
  cancelUrl?: string
}

export interface CheckoutSessionResponse {
  sessionId: string
  publishableKey: string
  checkoutUrl: string
}

export interface SubscriptionStatus {
  companyProfileId: number
  planId: number
  planName: string
  price: number
  billingCycle: string
  status: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  maxJobs: number
  maxUsers: number
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
}

export interface PaymentTransaction {
  id: number
  companyProfileId: number
  subscriptionPlanId?: number
  planName?: string
  stripeSessionId: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  failureReason?: string
  createdOn: string
}

export const paymentService = {
  async createCheckoutSession(data: CheckoutSessionRequest) {
    const response = await api.post<ApiResponse<CheckoutSessionResponse>>('/payments/create-checkout-session', data)
    return response.data.data
  },

  async verifySession(sessionId: string) {
    const response = await api.post<ApiResponse<SubscriptionStatus>>(`/payments/verify-session?sessionId=${encodeURIComponent(sessionId)}`)
    return response.data.data
  },

  async getCurrentSubscription() {
    const response = await api.get<ApiResponse<SubscriptionStatus>>('/payments/current-subscription')
    return response.data.data
  },

  async getTransactions() {
    const response = await api.get<ApiResponse<PaymentTransaction[]>>('/payments/transactions')
    return response.data.data
  },
}
