import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Search, Filter, ShieldAlert, LogIn, UserPlus, Trash2, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const logs = [
  { id: '1', action: 'User deleted', user: 'admin@hiregen.ai', target: 'spam@example.com', severity: 'high', timestamp: '2026-07-20T14:30:00', icon: Trash2, color: 'text-red-600 bg-red-100' },
  { id: '2', action: 'Plan changed', user: 'admin@hiregen.ai', target: 'Google → Enterprise', severity: 'medium', timestamp: '2026-07-20T12:00:00', icon: Edit, color: 'text-amber-600 bg-amber-100' },
  { id: '3', action: 'New admin login', user: 'admin@hiregen.ai', target: 'IP: 192.168.1.1', severity: 'info', timestamp: '2026-07-20T09:15:00', icon: LogIn, color: 'text-blue-600 bg-blue-100' },
  { id: '4', action: 'New user registered', user: 'james@apple.com', target: 'Candidate account', severity: 'info', timestamp: '2026-07-19T16:45:00', icon: UserPlus, color: 'text-emerald-600 bg-emerald-100' },
  { id: '5', action: 'Security alert', user: 'system', target: 'Failed login attempt x5', severity: 'critical', timestamp: '2026-07-19T03:20:00', icon: ShieldAlert, color: 'text-destructive bg-destructive/10' },
]

const severityColors: Record<string, 'destructive' | 'warning' | 'default' | 'outline'> = {
  critical: 'destructive', high: 'destructive', medium: 'warning', info: 'default',
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const filtered = logs.filter(l => l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Audit Logs" description="Track all platform activity" />
      <div className="relative max-w-sm"><Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
      <Card><CardContent className="p-0">
        <div className="space-y-0">
          {filtered.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50">
              <div className={`rounded-lg p-2 ${log.color}`}><log.icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{log.action}</p>
                  <Badge variant={severityColors[log.severity] || 'outline'}>{log.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium">{log.user}</span> — {log.target}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(log.timestamp, 'relative')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </motion.div>
  )
}
