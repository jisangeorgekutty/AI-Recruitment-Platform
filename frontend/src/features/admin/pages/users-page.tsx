import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/page-header'
import { Search, SlidersHorizontal, MoreHorizontal, Ban, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const users = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@google.com', role: 'recruiter', plan: 'Enterprise', status: 'active', jobs: 24, joined: 'Jan 2026' },
  { id: '2', name: 'Alex Kim', email: 'alex@stripe.com', role: 'candidate', plan: 'Free', status: 'active', jobs: 5, joined: 'Mar 2026' },
  { id: '3', name: 'Maria Lopez', email: 'maria@meta.com', role: 'recruiter', plan: 'Professional', status: 'suspended', jobs: 12, joined: 'Feb 2026' },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')

  const toggleStatus = (id: string, current: string) => {
    toast.success(`User ${current === 'active' ? 'suspended' : 'activated'}`)
  }

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Users" description="Manage platform users" />
      <div className="flex gap-3">
        <div className="relative flex-1"><Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
        <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" />Filters</Button>
      </div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b"><tr>{['User', 'Role', 'Plan', 'Status', 'Jobs', 'Joined', ''].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.plan}</td>
                  <td className="px-4 py-3"><Badge variant={u.status === 'active' ? 'success' : 'destructive'}>{u.status}</Badge></td>
                  <td className="px-4 py-3">{u.jobs}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleStatus(u.id, u.status)}>{u.status === 'active' ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}</Button>
                      <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </motion.div>
  )
}
