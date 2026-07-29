import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, CreditCard, Sparkles, Shield, Zap, RefreshCw, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation } from '@tanstack/react-query'
import { paymentService } from '@/services/payment.service'
import { adminService, type SubscriptionPlan } from '@/services/admin.service'
import { useSubscriptionStore } from '@/store/subscription-store'
import toast from 'react-hot-toast'

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: 'Starter / Free',
    price: 0,
    billingCycle: 'monthly',
    maxJobs: 3,
    maxUsers: 1,
    features: [
      'Up to 3 active job postings',
      'Basic AI resume screening',
      'Standard candidate pipeline',
      'Email notifications',
      'Community support',
    ],
    badgeColor: 'text-gray-600 bg-gray-100',
    subscribersCount: 584,
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Professional',
    price: 49,
    billingCycle: 'monthly',
    maxJobs: 25,
    maxUsers: 5,
    features: [
      'Up to 25 active job postings',
      'Advanced AI match scoring',
      'Full recruitment analytics',
      'AI video interview assistant',
      'Priority email & chat support',
    ],
    badgeColor: 'text-blue-600 bg-blue-100',
    subscribersCount: 312,
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    maxJobs: 100,
    maxUsers: 20,
    features: [
      'Unlimited active job postings',
      'Custom AI candidate models',
      'Dedicated account manager',
      'Custom ATS integrations',
      'Enterprise SLA & 24/7 Support',
    ],
    badgeColor: 'text-violet-600 bg-violet-100',
    subscribersCount: 48,
    displayOrder: 3,
  },
]

export default function BillingPage() {
  const { subscription, setSubscription, transactions, setTransactions, isCheckoutLoading, setCheckoutLoading } =
    useSubscriptionStore()

  // Fetch current subscription
  const { data: subData, isLoading: isSubLoading, refetch: refetchSub } = useQuery({
    queryKey: ['recruiter-subscription'],
    queryFn: paymentService.getCurrentSubscription,
  })

  // Fetch plans
  const { data: fetchedPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: adminService.getPlans,
  })

  // Fetch transaction history
  const { data: txData, isLoading: isTxLoading } = useQuery({
    queryKey: ['recruiter-transactions'],
    queryFn: paymentService.getTransactions,
  })

  useEffect(() => {
    if (subData) setSubscription(subData)
  }, [subData, setSubscription])

  useEffect(() => {
    if (txData) setTransactions(txData)
  }, [txData, setTransactions])

  // Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: (planId: number) =>
      paymentService.createCheckoutSession({
        planId,
        successUrl: `${window.location.origin}/recruiter/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/recruiter/subscription/cancel`,
      }),
    onMutate: () => setCheckoutLoading(true),
    onSuccess: (data) => {
      toast.success('Redirecting to Stripe secure checkout...')
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        toast.error('Unable to retrieve checkout URL')
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to initiate Stripe Checkout')
    },
    onSettled: () => setCheckoutLoading(false),
  })

  const plans = fetchedPlans && fetchedPlans.length > 0 ? fetchedPlans : DEFAULT_PLANS
  const currentPlanId = subscription?.planId ?? 1

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your company subscription plan, view job posting limits, and payment history.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchSub()} className="gap-2 self-start md:self-auto">
          <RefreshCw className="h-4 w-4" /> Sync Plan Status
        </Button>
      </div>

      {/* Active Subscription Overview Card */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 shadow-md">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Active Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-xl font-bold">{subscription?.planName || 'Starter / Free'}</h3>
                  <Badge variant="default" className="capitalize bg-emerald-600 hover:bg-emerald-700">
                    {subscription?.status || 'Active'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Job Limit</p>
                <p className="text-lg font-bold mt-1">Up to {subscription?.maxJobs ?? 3} Active Jobs</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Billing Renewal</p>
                <p className="text-sm font-semibold mt-1">
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Auto-renews monthly'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Pricing Plans Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Available Subscription Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isPopular = plan.name.toLowerCase().includes('pro')

            return (
              <motion.div key={plan.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card
                  className={`relative flex h-full flex-col justify-between border transition-all ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                      : isPopular
                      ? 'border-primary shadow-md'
                      : 'border-border'
                  }`}
                >
                  {isPopular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-0.5 text-xs font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600 text-white px-3 py-0.5 text-xs font-medium">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-8">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.price === 0 ? 'Free tier for small hiring needs' : 'For growing hiring teams'}
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                      <span className="text-sm font-medium text-muted-foreground">/{plan.billingCycle || 'month'}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col justify-between">
                    <ul className="mb-8 space-y-3">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={isCurrent ? 'outline' : isPopular ? 'default' : 'secondary'}
                      className="w-full font-semibold"
                      disabled={isCurrent || isCheckoutLoading}
                      onClick={() => checkoutMutation.mutate(plan.id)}
                    >
                      {isCurrent ? (
                        'Active Plan'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard className="h-4 w-4" /> Select {plan.name}
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Payment Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" /> Payment History & Receipts
          </CardTitle>
          <CardDescription>View all recent billing transactions processed via Stripe.</CardDescription>
        </CardHeader>
        <CardContent>
          {isTxLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transaction history...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground font-medium">No payment transactions found.</p>
              <p className="text-xs text-muted-foreground mt-1">Your payments will appear here once you upgrade.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Stripe Session ID</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {new Date(tx.createdOn).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">{tx.planName || 'Subscription Plan'}</td>
                      <td className="px-4 py-3 font-bold">${tx.amount.toFixed(2)} USD</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.stripeSessionId}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            tx.status === 'succeeded'
                              ? 'default'
                              : tx.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="capitalize"
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
