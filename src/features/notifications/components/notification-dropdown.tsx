import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border bg-card shadow-xl">
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => { markAllAsRead() }}
            className="text-xs text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                if (!notification.read) markAsRead(notification.id)
                if (notification.link) navigate(notification.link)
                onClose()
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
              </div>
              {!notification.read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => { navigate('/notifications'); onClose() }}
        >
          View all notifications
        </Button>
      </div>
    </div>
  )
}
