import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { adminService, type SubscriptionPlan } from '@/services/admin.service'

const DEFAULT_PLANS = [
  {
    id: 1,
    name: 'Starter / Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Up to 3 active jobs',
      'Basic AI resume screening',
      'Standard analytics',
      'Email notifications',
      'Community support',
    ],
    badgeColor: 'text-gray-600 bg-gray-100',
    subscribersCount: 584,
  },
  {
    id: 2,
    name: 'Professional',
    price: 49,
    billingCycle: 'monthly',
    features: [
      'Up to 25 active jobs',
      'Advanced AI scoring & matching',
      'Full recruitment analytics',
      'AI video interview assistant',
      'Priority email & chat support',
    ],
    badgeColor: 'text-blue-600 bg-blue-100',
    subscribersCount: 312,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Unlimited active jobs',
      'Custom AI interview models',
      'Dedicated account manager',
      'Custom ATS integrations',
      'SLA & enterprise security',
    ],
    badgeColor: 'text-violet-600 bg-violet-100',
    subscribersCount: 48,
  },
]

export function PricingSection() {
  const navigate = useNavigate()

  const { data: fetchedPlans, isLoading } = useQuery({
    queryKey: ['public-plans'],
    queryFn: adminService.getPlans,
  })

  const plans: (SubscriptionPlan | typeof DEFAULT_PLANS[0])[] =
    fetchedPlans && fetchedPlans.length > 0 ? fetchedPlans : DEFAULT_PLANS

  return (
    <section id="pricing" className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <Badge variant="info" className="mb-4 px-4 py-1.5 text-sm font-medium">
            Pricing & Plans
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. Choose the right plan to power your recruitment pipeline with AI.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading pricing plans...</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => {
              const isPopular = plan.name.toLowerCase().includes('pro')
              return (
                <motion.div
                  key={plan.id || plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={cn('relative h-full transition-all', isPopular && 'border-primary shadow-lg shadow-primary/10')}>
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="px-4 py-1 text-xs font-medium">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="flex h-full flex-col p-6 pt-8">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {plan.price === 0 ? 'Get started for free' : 'For growing hiring teams'}
                        </p>
                      </div>

                      <div className="mb-6">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.price > 0 ? `/${plan.billingCycle || 'month'}` : ''}
                        </span>
                      </div>

                      <ul className="mb-8 space-y-3 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm">
                            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isPopular ? 'default' : 'outline'}
                        size="lg"
                        className="w-full font-semibold"
                        onClick={() => navigate('/register')}
                      >
                        {plan.price === 0 ? 'Start Free' : 'Choose Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
