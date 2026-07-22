import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Edit, Users, DollarSign, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const plans = [
  { name: 'Free', price: '$0', users: 10, jobs: 3, features: ['Basic job posting', 'Email support'], subscribers: 584, color: 'text-gray-600 bg-gray-100' },
  { name: 'Professional', price: '$49/mo', users: 50, jobs: 25, features: ['Unlimited job posting', 'AI matching', 'Priority support'], subscribers: 312, color: 'text-blue-600 bg-blue-100' },
  { name: 'Enterprise', price: '$199/mo', users: 500, jobs: 500, features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA'], subscribers: 48, color: 'text-violet-600 bg-violet-100' },
]

export default function AdminPlansPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Plans & Pricing" description="Manage subscription plans" />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(p => (
          <Card key={p.name} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`rounded-lg p-2 ${p.color}`}><DollarSign className="h-4 w-4" /></div>
                <h3 className="text-lg font-bold">{p.name}</h3>
              </div>
              <p className="text-3xl font-bold mb-4">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.name !== 'Free' ? '/month' : ''}</span></p>
              <div className="space-y-2 text-xs text-muted-foreground mb-4">
                <p className="flex items-center gap-2"><Users className="h-3 w-3" />Up to {p.users} users</p>
                <p className="flex items-center gap-2"><Zap className="h-3 w-3" />Up to {p.jobs} active jobs</p>
              </div>
              <div className="space-y-1.5 mb-4">
                {p.features.map(f => <p key={f} className="text-xs flex items-center gap-2"><span className="text-emerald-500">✓</span>{f}</p>)}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{p.subscribers} subscribers</Badge>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Editing ${p.name} plan`)}><Edit className="mr-2 h-4 w-4" />Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
