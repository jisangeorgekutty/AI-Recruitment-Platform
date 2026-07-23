import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Search, Building2, MoreHorizontal, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const companies = [
  { id: '1', name: 'Google', email: 'admin@google.com', industry: 'Technology', plan: 'Enterprise', status: 'verified', employees: '10,000+', jobs: 45 },
  { id: '2', name: 'Stripe', email: 'admin@stripe.com', industry: 'Fintech', plan: 'Professional', status: 'verified', employees: '5,000+', jobs: 28 },
  { id: '3', name: 'Figma', email: 'admin@figma.com', industry: 'Design', plan: 'Professional', status: 'pending', employees: '1,000+', jobs: 12 },
  { id: '4', name: 'StartupXYZ', email: 'hello@startupxyz.io', industry: 'SaaS', plan: 'Free', status: 'pending', employees: '10-50', jobs: 3 },
]

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('')
  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleVerify = (id: string) => toast.success('Company verified')
  const handleReject = (id: string) => toast.success('Company rejected')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Companies" description="Manage registered companies" />
      <div className="relative max-w-sm"><Input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <Card key={c.id}><CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-3"><Building2 className="h-5 w-5 text-primary" /></div>
              <div className="min-w-0"><h3 className="font-semibold truncate">{c.name}</h3><p className="text-xs text-muted-foreground truncate">{c.industry}</p></div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <p>{c.email}</p><p>{c.employees} employees</p><p>{c.jobs} active jobs</p>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={c.status === 'verified' ? 'success' : 'warning'}>{c.status}</Badge>
              <div className="flex gap-1">
                {c.status === 'pending' && <><Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleVerify(c.id)}><Check className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleReject(c.id)}><X className="h-4 w-4" /></Button></>}
                <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </motion.div>
  )
}
