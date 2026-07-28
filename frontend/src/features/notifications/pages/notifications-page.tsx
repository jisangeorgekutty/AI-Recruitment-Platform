import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { NotificationItem } from '@/features/notifications/components/notification-item'
import { useNotificationStore } from '@/store/notification-store'
import { notificationService } from '@/services/notification.service'
import { Bell, CheckCheck } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
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

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id)
      removeNotification(id)
      invalidateAll()
    } catch { }
  }

  const list = data?.data ?? notifications

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your recruitment activities"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading notifications...</p>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="No notifications"
          description="You're all caught up"
        />
      ) : (
        <div className="max-w-2xl space-y-1">
          {list.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
