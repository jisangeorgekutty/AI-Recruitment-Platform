import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const traditional = [
  'Manual resume screening',
  'Hours spent on admin',
  'Biased hiring decisions',
  'Scattered candidate data',
  'Slow interview scheduling',
  'No hiring analytics',
]

const hiregen = [
  'AI-powered resume scoring',
  'Automated workflows',
  'Data-driven decisions',
  'Centralized platform',
  'One-click scheduling',
  'Real-time analytics',
]

export function WhyChooseSection() {
  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose HireGen AI?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional hiring is broken. We fix it with AI-powered precision.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-destructive">Traditional Hiring</h3>
                <ul className="space-y-4">
                  {traditional.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <X className="h-3 w-3 text-destructive" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-primary">HireGen AI</h3>
                <ul className="space-y-4">
                  {hiregen.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
