import { X } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Notification } from '@/types'

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const isRead = notification.read ?? notification.isRead
  const createdAt = notification.createdAt || notification.createdOn || new Date().toISOString()

  return (
    <div
      className={cn(
        'group flex items-start justify-between gap-3 rounded-xl p-4 transition-colors border',
        !isRead ? 'bg-primary/5 border-primary/20' : 'bg-card border-border hover:bg-muted/50',
      )}
      onClick={() => !isRead && onMarkRead(notification.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm', !isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>
            {notification.title}
          </p>
          {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
        <p className="text-[11px] text-muted-foreground/70 mt-1.5">{formatDate(createdAt, 'relative')}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
        className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
