import { Bell } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  onClick: () => void
  className?: string
}

export function NotificationBell({ onClick, className }: NotificationBellProps) {
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  return (
    <button
      onClick={onClick}
      className={cn('relative rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors', className)}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
