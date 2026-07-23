import { motion } from 'framer-motion'
import { Briefcase, Users, Video, Award } from 'lucide-react'

const steps = [
  { icon: Briefcase, title: 'Post a Job', description: 'Create a detailed job posting with requirements, responsibilities, and scoring criteria in minutes.' },
  { icon: Users, title: 'Receive AI Ranked Candidates', description: 'Candidates apply and our AI automatically parses resumes, scores them, and ranks by fit.' },
  { icon: Video, title: 'Interview Candidates', description: 'Schedule and conduct interviews with built-in video, coding assessments, and collaborative feedback.' },
  { icon: Award, title: 'Hire the Best Talent', description: 'Make data-driven hiring decisions with comprehensive analytics and team consensus.' },
]

export function HowItWorksSection() {
  return (
    <section id="solutions" className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From posting a job to making an offer — four simple steps to transform your hiring.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[60%] top-12 hidden h-0.5 w-[80%] bg-gradient-to-r from-primary/40 to-primary/10 md:block" />
              )}

              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <step.icon className="h-10 w-10 text-primary" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
