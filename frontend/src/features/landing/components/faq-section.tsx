import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How does the AI resume scoring work?',
    answer: 'Our AI analyzes resumes against job descriptions using natural language processing. It evaluates skills, experience, education, and achievements to generate a comprehensive match score. The model is trained on millions of hiring decisions and continuously improves.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card is required. You can upgrade, downgrade, or cancel at any time.',
  },
  {
    question: 'Can I customize the AI scoring criteria?',
    answer: 'Absolutely. Professional and Enterprise plans allow you to customize scoring weights, add required skills, define deal-breakers, and train the AI on your historical hiring data for more accurate results.',
  },
  {
    question: 'How secure is my data?',
    answer: 'HireGen AI is SOC 2 Type II compliant. We use end-to-end encryption for all data in transit and at rest. Our infrastructure runs on AWS with strict access controls, regular security audits, and GDPR compliance.',
  },
  {
    question: 'Can I integrate with my existing ATS?',
    answer: 'Yes, HireGen AI integrates with major ATS platforms including Greenhouse, Lever, Workday, BambooHR, and more. We also provide a REST API and webhooks for custom integrations.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include email support. Professional plans get priority support with 4-hour response times. Enterprise plans include a dedicated account manager, phone support, and 1-hour SLA.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about HireGen AI.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === i && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
