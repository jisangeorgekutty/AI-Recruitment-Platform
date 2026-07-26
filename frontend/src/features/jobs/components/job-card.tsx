import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, Eye, Clock, MoreHorizontal, Copy, Edit, Archive, Trash2, Play, Pause, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  onDuplicate?: (id: number | string) => void
  onStatusChange?: (id: number | string, status: string) => void
  onDelete?: (id: number | string) => void
}

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'info'> = {
  Active: 'success',
  published: 'success',
  Draft: 'warning',
  draft: 'warning',
  Paused: 'info',
  paused: 'info',
  Closed: 'destructive',
  closed: 'destructive',
  Archived: 'secondary',
  archived: 'secondary',
}

export function JobCard({ job, onDuplicate, onStatusChange, onDelete }: JobCardProps) {
  const currentStatus = job.status || 'Draft'
  const isPublishable = currentStatus === 'Draft' || currentStatus === 'draft' || currentStatus === 'Paused' || currentStatus === 'paused' || currentStatus === 'Closed' || currentStatus === 'closed'
  const isPausable = currentStatus === 'Active' || currentStatus === 'published'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/recruiter/jobs/${job.id}`}>
        <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold truncate">{job.title}</h3>
                  <Badge variant={statusVariants[currentStatus] || 'secondary'}>{currentStatus}</Badge>
                  {job.remoteType && <Badge variant="outline">{job.remoteType}</Badge>}
                  {job.employmentType && <Badge variant="info">{job.employmentType}</Badge>}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.applicationsCount ?? 0} applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {job.viewsCount ?? 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(job.createdOn || job.createdAt || new Date().toISOString(), 'relative')}
                  </span>
                </div>

                {(job.salaryMin || job.salaryMax) && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {job.currency === 'USD' ? '$' : job.currency} {job.salaryMin ? job.salaryMin.toLocaleString() : '0'} - {job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}
                  </p>
                )}
              </div>

              <DropdownMenu
                trigger={
                  <button
                    className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                }
                align="end"
              >
                {isPublishable && (
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); onStatusChange?.(job.id, 'Active') }}>
                    <Play className="h-4 w-4 text-emerald-500" /> Publish Job
                  </DropdownMenuItem>
                )}
                {isPausable && (
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); onStatusChange?.(job.id, 'Paused') }}>
                    <Pause className="h-4 w-4 text-amber-500" /> Pause Hiring
                  </DropdownMenuItem>
                )}
                {currentStatus !== 'Closed' && currentStatus !== 'closed' && (
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); onStatusChange?.(job.id, 'Closed') }}>
                    <XCircle className="h-4 w-4 text-rose-500" /> Close Position
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); onDuplicate?.(job.id) }}>
                  <Copy className="h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); onStatusChange?.(job.id, 'Archived') }}>
                  <Archive className="h-4 w-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); onDelete?.(job.id) }} destructive>
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
