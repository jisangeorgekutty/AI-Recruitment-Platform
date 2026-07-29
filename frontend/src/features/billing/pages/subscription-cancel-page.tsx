import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SubscriptionCancelPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-lg">
        <Card className="border-amber-500/20 bg-card shadow-xl text-center">
          <CardHeader className="pt-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50">
              <XCircle className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Checkout Cancelled</CardTitle>
            <CardDescription className="text-base mt-2">
              Your Stripe payment process was cancelled. No charges were made to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              You can return to the plans page anytime when you are ready to upgrade your recruitment pipeline capacity.
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full font-semibold gap-2" onClick={() => navigate('/recruiter/billing')}>
                <RefreshCcw className="h-4 w-4" /> Try Again / Select Plan
              </Button>
              <Button variant="ghost" onClick={() => navigate('/recruiter/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
