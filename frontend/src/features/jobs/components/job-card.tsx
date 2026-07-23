import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, Eye, Clock, MoreHorizontal, Copy, Edit, Archive, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  onDuplicate?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  closed: 'destructive',
  archived: 'secondary',
}

const typeVariants: Record<string, 'info' | 'default' | 'outline'> = {
  remote: 'info',
  contract: 'default',
  'full-time': 'outline',
  'part-time': 'outline',
  internship: 'outline',
}

export function JobCard({ job, onDuplicate, onArchive, onDelete }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/jobs/${job.id}`}>
        <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold truncate">{job.title}</h3>
                  <Badge variant={statusVariants[job.status]}>{job.status}</Badge>
                  <Badge variant={typeVariants[job.type] || 'outline'}>{job.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.applicationsCount} applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {job.viewsCount} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(job.createdAt, 'relative')}
                  </span>
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <p className="text-sm font-medium text-primary">
                    {job.salaryMin ? formatCurrency(job.salaryMin) : ''} - {job.salaryMax ? formatCurrency(job.salaryMax) : ''}
                  </p>
                )}
              </div>
              <DropdownMenu
                trigger={
                  <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent" onClick={(e) => e.preventDefault()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                }
                align="end"
              >
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); onDuplicate?.(job.id) }}>
                  <Copy className="h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); /* navigate to edit */ }}>
                  <Edit className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); onArchive?.(job.id) }}>
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
