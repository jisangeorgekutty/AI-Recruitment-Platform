import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <div className="ml-3 h-5 flex-1 max-w-[200px] rounded-md bg-muted" />
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-8 w-24 rounded-lg bg-primary/20" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Jobs', value: '24', color: 'bg-primary/10 text-primary' },
              { label: 'Candidates', value: '847', color: 'bg-emerald-500/10 text-emerald-600' },
              { label: 'Interviews', value: '12', color: 'bg-amber-500/10 text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-3 ${stat.color}`}>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Recent Candidates</span>
              <Badge variant="outline" className="text-xs">AI Scored</Badge>
            </div>
            {[
              { name: 'Sarah Chen', role: 'Senior Frontend Engineer', score: 96, avatar: 'SC' },
              { name: 'Marcus Johnson', role: 'Backend Developer', score: 92, avatar: 'MJ' },
              { name: 'Emily Rodriguez', role: 'Product Designer', score: 88, avatar: 'ER' },
            ].map((candidate) => (
              <div key={candidate.name} className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
                <Avatar name={candidate.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
                </div>
                <div className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {candidate.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={item}>
              <Badge variant="info" className="mb-4 px-4 py-1.5 text-sm font-medium">
                Now in Public Beta
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              AI-Powered Recruitment{' '}
              <span className="text-primary">for Modern Teams</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              Hire faster with AI resume screening, ATS scoring, interview automation,
              coding assessments, and powerful hiring analytics — all in one platform.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 text-base px-8" onClick={() => navigate('/auth/register')}>
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free 14-day trial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Cancel anytime
              </span>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
