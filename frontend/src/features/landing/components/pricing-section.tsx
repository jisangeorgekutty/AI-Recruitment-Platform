import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started.',
    price: '$29',
    period: '/month',
    features: [
      'Up to 3 active jobs',
      'AI resume screening',
      'Basic analytics',
      'Email notifications',
      '5 team members',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams that need more power.',
    price: '$79',
    period: '/month',
    features: [
      'Up to 15 active jobs',
      'Advanced AI scoring',
      'Full analytics suite',
      'Video interviews',
      'Coding assessments',
      'Unlimited team members',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For organizations with complex hiring needs.',
    price: '$199',
    period: '/month',
    features: [
      'Unlimited active jobs',
      'Custom AI models',
      'Enterprise analytics',
      'SSO & SAML',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export function PricingSection() {
  const navigate = useNavigate()

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
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No surprises. Scale as you grow.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className={cn('relative h-full', plan.popular && 'border-primary shadow-lg shadow-primary/10')}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 text-xs font-medium">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="flex h-full flex-col p-6 pt-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="mb-8 space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/register')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
