import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  description?: string
  className?: string
  isLoading?: boolean
}

export function StatCard({ title, value, icon, trend, description, className, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {(trend || description) && (
                <div className="flex items-center gap-2">
                  {trend && (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        trend.positive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive',
                      )}
                    >
                      {trend.positive ? '+' : ''}{trend.value}%
                    </span>
                  )}
                  {description && (
                    <span className="text-xs text-muted-foreground">{description}</span>
                  )}
                </div>
              )}
            </div>
            {icon && (
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
