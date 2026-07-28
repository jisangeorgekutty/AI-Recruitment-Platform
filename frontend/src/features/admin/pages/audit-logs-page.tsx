import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Search, ShieldAlert, LogIn, UserPlus, Trash2, Edit, Activity as ActivityIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

const severityColors: Record<string, 'destructive' | 'warning' | 'default' | 'outline'> = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'warning',
  info: 'default',
}

const severityIcons: Record<string, any> = {
  critical: ShieldAlert,
  high: Trash2,
  medium: Edit,
  info: LogIn,
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const { auditLogs, setAuditLogs } = useAdminStore()

  const { data: fetchedLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', search],
    queryFn: () => adminService.getAuditLogs({ search }),
  })

  useEffect(() => {
    if (fetchedLogs) {
      setAuditLogs(fetchedLogs)
    }
  }, [fetchedLogs, setAuditLogs])

  const list = auditLogs.length > 0 ? auditLogs : fetchedLogs ?? [
    { id: 1, action: 'User deleted', userEmail: 'admin@hiregen.ai', target: 'spam@example.com', severity: 'high', createdOn: '2026-07-20T14:30:00Z' },
    { id: 2, action: 'Plan changed', userEmail: 'admin@hiregen.ai', target: 'Google → Enterprise', severity: 'medium', createdOn: '2026-07-20T12:00:00Z' },
    { id: 3, action: 'New admin login', userEmail: 'admin@hiregen.ai', target: 'IP: 192.168.1.1', severity: 'info', createdOn: '2026-07-20T09:15:00Z' },
    { id: 4, action: 'New user registered', userEmail: 'james@apple.com', target: 'Candidate account', severity: 'info', createdOn: '2026-07-19T16:45:00Z' },
    { id: 5, action: 'Security alert', userEmail: 'system', target: 'Failed login attempt x5', severity: 'critical', createdOn: '2026-07-19T03:20:00Z' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Audit Logs" description="Track all platform activity" />
      <div className="relative max-w-sm">
        <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {isLoading ? (
              <p className="p-8 text-center text-muted-foreground">Loading audit logs...</p>
            ) : list.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No audit logs found</p>
            ) : (
              list.map((log) => {
                const IconComponent = severityIcons[log.severity] || ActivityIcon
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50">
                    <div className="rounded-lg p-2 bg-primary/10 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{log.action}</p>
                        <Badge variant={severityColors[log.severity] || 'outline'}>{log.severity}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium">{log.userEmail}</span> — {log.target}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(log.createdOn, 'relative')}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
