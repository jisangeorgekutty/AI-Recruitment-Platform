import { motion } from 'framer-motion'
import {
  FileSearch,
  Trophy,
  ArrowUpDown,
  MessageSquarePlus,
  Video,
  Code2,
  BarChart3,
  Users,
  Bell,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  { icon: FileSearch, title: 'AI Resume Screening', description: 'Automatically parse, extract, and analyze resumes with AI-powered natural language processing.' },
  { icon: Trophy, title: 'ATS Resume Score', description: 'Get instant AI-driven scoring against job descriptions to rank top candidates.' },
  { icon: ArrowUpDown, title: 'AI Candidate Ranking', description: 'Rank applicants by relevance, skills match, experience, and cultural fit automatically.' },
  { icon: MessageSquarePlus, title: 'AI Interview Questions', description: 'Generate tailored interview questions based on job requirements and candidate profiles.' },
  { icon: Video, title: 'Live Video Interview', description: 'Built-in video conferencing with recording, transcription, and real-time collaboration.' },
  { icon: Code2, title: 'Coding Assessment', description: 'Customizable coding challenges with real-time evaluation and plagiarism detection.' },
  { icon: BarChart3, title: 'Hiring Analytics', description: 'Comprehensive dashboards and reports to optimize your recruitment funnel.' },
  { icon: Users, title: 'Team Collaboration', description: 'Share feedback, scorecards, and evaluations across your hiring team seamlessly.' },
  { icon: Bell, title: 'Real-time Notifications', description: 'Stay updated with instant alerts for applications, interviews, and offers.' },
  { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption, role-based access, and audit logs.' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to hire better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools that streamline your entire recruitment workflow from posting to offer.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full cursor-default transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="mb-2 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
