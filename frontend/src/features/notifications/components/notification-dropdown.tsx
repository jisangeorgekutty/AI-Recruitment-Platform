import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'
import { useAuthStore } from '@/store/auth-store'
import { notificationService } from '@/services/notification.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead, markAllAsRead } = useNotificationStore()

  const { data, isLoading } = useQuery({
    queryKey: ['header-dropdown-notifications'],
    queryFn: () => notificationService.list(),
  })

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data)
      setUnreadCount(data.unreadCount ?? 0)
    }
  }, [data, setNotifications, setUnreadCount])

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['candidate-notifications'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['header-bell-notifications'] })
    queryClient.invalidateQueries({ queryKey: ['header-dropdown-notifications'] })
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      markAllAsRead()
      invalidateAll()
    } catch { }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      markAsRead(id)
      invalidateAll()
    } catch { }
  }

  const notificationsPath = user?.role === 'candidate' ? '/candidate/notifications' : '/recruiter/notifications'
  const displayList = data?.data ?? notifications

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
            onClick={handleMarkAllRead}
            className="text-xs text-primary hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {isLoading && displayList.length === 0 ? (
          <p className="text-center py-6 text-xs text-muted-foreground">Loading notifications...</p>
        ) : displayList.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          displayList.slice(0, 10).map((notification) => {
            const isRead = Boolean(notification.read || notification.isRead)
            return (
              <div
                key={notification.id}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  if (!isRead) handleMarkRead(notification.id)
                  if (notification.link || notification.linkUrl) {
                    navigate(notification.link || notification.linkUrl!)
                  } else {
                    navigate(notificationsPath)
                  }
                  onClose()
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                </div>
                {!isRead && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-xs font-medium"
          onClick={() => {
            navigate(notificationsPath)
            onClose()
          }}
        >
          View all notifications
        </Button>
      </div>
    </div>
  )
}
