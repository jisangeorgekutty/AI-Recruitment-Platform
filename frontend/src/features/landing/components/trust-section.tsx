import { motion } from 'framer-motion'

const companies = [
  { name: 'Microsoft', style: 'font-semibold tracking-tight' },
  { name: 'Google', style: 'font-semibold tracking-tight' },
  { name: 'Amazon', style: 'font-semibold tracking-tight' },
  { name: 'IBM', style: 'font-semibold tracking-tight' },
  { name: 'Accenture', style: 'font-semibold tracking-tight' },
  { name: 'Deloitte', style: 'font-semibold tracking-tight' },
]

export function TrustSection() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm font-medium text-muted-foreground"
        >
          Trusted by leading companies worldwide
        </motion.p>
        <div className="grid grid-cols-3 items-center gap-8 md:grid-cols-6">
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-center"
            >
              <span className={`text-xl text-muted-foreground/60 ${company.style}`}>
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
