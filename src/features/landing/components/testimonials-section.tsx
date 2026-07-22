import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'VP of Talent Acquisition, Microsoft',
    avatar: 'AT',
    content: 'HireGen AI has completely transformed our recruitment workflow. We reduced time-to-hire by 60% while improving candidate quality scores.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Head of People, Stripe',
    avatar: 'PS',
    content: 'The AI resume scoring is remarkably accurate. It surfaces candidates we would have otherwise missed and eliminates bias from the screening process.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'CTO, Figma',
    avatar: 'DC',
    content: 'The coding assessment integration with AI-powered interview questions gives us a complete picture of every candidate. Essential for technical hiring.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by industry leaders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See why top companies are switching to HireGen AI for their recruitment needs.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-4 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={cn('h-4 w-4', j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">"{t.content}"</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar name={t.name} size="md" />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
