import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { History, Calendar, Star, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const history = [
  { id: '1', company: 'Figma', role: 'Product Designer', date: '2026-07-16', status: 'completed', feedback: 4.5, notes: 'Strong design portfolio. Good cultural fit.' },
  { id: '2', company: 'Amazon', role: 'Frontend Engineer', date: '2026-07-10', status: 'completed', feedback: 3.5, notes: 'Technical skills are solid. Could improve system design.' },
  { id: '3', company: 'Netflix', role: 'UI Engineer', date: '2026-07-05', status: 'cancelled', feedback: null, notes: 'Position was put on hold.' },
]

export default function CandidateInterviewHistoryPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Interview History" description="Past interviews and feedback" />
      {history.length === 0 ? (
        <EmptyState icon={<History className="h-12 w-12" />} title="No interview history" />
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={item.company} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{item.role}</h3>
                      <Badge variant={item.status === 'completed' ? 'success' : 'destructive'}>{item.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Calendar className="h-3 w-3" />{formatDate(item.date, 'long')}</p>
                    {item.feedback && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < Math.floor(item.feedback!) ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{item.feedback}/5</span>
                      </div>
                    )}
                    {item.notes && <p className="mt-2 text-sm text-muted-foreground flex items-start gap-1.5"><MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />{item.notes}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
