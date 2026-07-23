import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

function RecruiterDashboardMockup() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recruiter Dashboard</CardTitle>
          <Badge variant="info" className="text-[10px]">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[{ label: 'Active Jobs', value: '12', color: 'text-primary' }, { label: 'New Apps', value: '48', color: 'text-emerald-500' }].map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/50 p-2.5">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1.5">
          {[{ name: 'Senior Frontend', match: 24 }, { name: 'Backend Engineer', match: 18 }, { name: 'Product Manager', match: 12 }].map((job) => (
            <div key={job.name} className="flex items-center justify-between text-xs">
              <span className="font-medium">{job.name}</span>
              <span className="text-muted-foreground">{job.match} candidates</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AnalyticsMockup() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Hiring Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          {[
            { label: 'Application → Screen', value: 68, color: 'bg-primary' },
            { label: 'Screen → Interview', value: 45, color: 'bg-emerald-500' },
            { label: 'Interview → Offer', value: 22, color: 'bg-amber-500' },
            { label: 'Offer → Hire', value: 18, color: 'bg-violet-500' },
          ].map((stage) => (
            <div key={stage.label} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="font-medium">{stage.value}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={cn('h-full rounded-full', stage.color)} style={{ width: `${stage.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Avg. Time to Hire</span>
          <span className="font-bold text-primary">14 days</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ResumeAnalysisMockup() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">AI Resume Analysis</CardTitle>
          <Badge variant="success" className="text-[10px]">96% Match</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <Avatar name="SC" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">Sarah Chen</p>
            <p className="text-[10px] text-muted-foreground">Senior Frontend Engineer</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'].map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
          ))}
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div><p className="font-bold text-primary">92</p><p className="text-muted-foreground">Skills</p></div>
          <div><p className="font-bold text-emerald-500">95</p><p className="text-muted-foreground">Exp.</p></div>
          <div><p className="font-bold text-amber-500">88</p><p className="text-muted-foreground">Edu.</p></div>
        </div>
      </CardContent>
    </Card>
  )
}

function JobPipelineMockup() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Candidate Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {[
          { stage: 'Applied', count: 48, color: 'bg-primary' },
          { stage: 'Screened', count: 24, color: 'bg-violet-500' },
          { stage: 'Interview', count: 8, color: 'bg-amber-500' },
          { stage: 'Offer', count: 3, color: 'bg-emerald-500' },
          { stage: 'Hired', count: 1, color: 'bg-blue-500' },
        ].map((s) => (
          <div key={s.stage} className="flex items-center gap-2.5">
            <span className="w-16 text-[10px] text-muted-foreground">{s.stage}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className={cn('h-full rounded-full', s.color)} style={{ width: `${(s.count / 48) * 100}%` }} />
            </div>
            <span className="w-5 text-right text-[10px] font-medium">{s.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardPreviewSection() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful dashboards, beautiful insights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need at a glance — from recruiter workflows to hiring analytics.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[RecruiterDashboardMockup, AnalyticsMockup, ResumeAnalysisMockup, JobPipelineMockup].map((Component, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Component />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
