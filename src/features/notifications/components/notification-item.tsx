import { UserPlus, Calendar, Award, Bell, Mail, Clock, X } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Notification } from '@/types'

const iconMap = {
  application: UserPlus,
  interview: Calendar,
  offer: Award,
  system: Bell,
  message: Mail,
  reminder: Clock,
}

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const Icon = iconMap[notification.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl p-3 transition-colors',
        !notification.read ? 'bg-primary/5' : 'hover:bg-muted/50',
      )}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className={cn(
        'rounded-lg p-2',
        notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', !notification.read && 'font-semibold')}>{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt, 'relative')}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
        className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
