import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { NotificationItem } from '@/features/notifications/components/notification-item'
import { useNotificationStore } from '@/store/notification-store'
import { Bell, CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your recruitment activities"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="No notifications"
          description="You're all caught up"
        />
      ) : (
        <div className="max-w-2xl space-y-1">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onDelete={removeNotification}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
