import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, ShieldCheck, Mail, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { paymentService, type SubscriptionStatus } from '@/services/payment.service'
import { useSubscriptionStore } from '@/store/subscription-store'
import toast from 'react-hot-toast'

export default function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session_id')
  const { setSubscription } = useSubscriptionStore()

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('Missing payment session reference ID.')
      setLoading(false)
      return
    }

    let isMounted = true
    paymentService
      .verifySession(sessionId)
      .then((data) => {
        if (isMounted) {
          setStatus(data)
          setSubscription(data)
          setLoading(false)
          toast.success('Subscription plan activated successfully!')
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Failed to verify payment session.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [sessionId, setSubscription])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-lg">
        <Card className="border-emerald-500/20 bg-card shadow-2xl text-center">
          <CardHeader className="pt-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Payment Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you! Your recruiter subscription plan has been activated.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {loading ? (
              <div className="py-6 text-muted-foreground animate-pulse">
                Verifying Stripe payment session details...
              </div>
            ) : error ? (
              <div className="rounded-xl bg-destructive/10 p-4 text-destructive text-sm font-medium">
                {error}
              </div>
            ) : status ? (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-muted/40 p-4 text-left space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Plan Name</span>
                    <span className="font-bold text-foreground">{status.planName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Billing Price</span>
                    <span className="font-bold text-emerald-600">${status.price} USD</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Max Active Jobs</span>
                    <span className="font-bold text-foreground">{status.maxJobs} Jobs</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Status</span>
                    <span className="font-bold text-emerald-600 capitalize">{status.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Mail className="h-4 w-4 text-primary" /> A confirmation receipt email has been sent to your inbox.
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 pt-2">
              <Button size="lg" className="w-full font-bold gap-2" onClick={() => navigate('/recruiter/dashboard')}>
                Return to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/recruiter/billing')}>
                Manage Subscriptions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
