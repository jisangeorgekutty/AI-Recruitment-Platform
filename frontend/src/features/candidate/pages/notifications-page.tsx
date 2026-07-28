import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notification.service'
import { useNotificationStore } from '@/store/notification-store'
import toast from 'react-hot-toast'

export default function CandidateNotificationsPage() {
  const queryClient = useQueryClient()
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-notifications'],
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
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
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
      toast.success('Notification removed')
    } catch { }
  }

  const list = data?.data ?? notifications

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your applications and interviews"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
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
        <div className="max-w-2xl space-y-2">
          {list.map((n) => {
            const isRead = Boolean(n.read || n.isRead)
            const createdTime = n.createdAt || n.createdOn || new Date().toISOString()
            return (
              <div
                key={n.id}
                onClick={() => !isRead && handleMarkRead(n.id)}
                className={cn(
                  'group flex items-start justify-between gap-3 rounded-xl p-4 transition-all cursor-pointer border',
                  !isRead ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card border-border hover:bg-muted/40'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm', !isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>
                      {n.title}
                    </p>
                    {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1.5">{formatDate(createdTime, 'relative')}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(n.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
