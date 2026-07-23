import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTASection() {
  const navigate = useNavigate()

  return (
    <section className="border-y bg-gradient-to-br from-primary/5 via-primary/10 to-background py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join thousands of companies using HireGen AI to hire better, faster, and smarter.
            Start your free trial today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2 text-base px-8" onClick={() => navigate('/register')}>
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Contact Sales
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
