import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, LogOut, Moon, Sun, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { useThemeStore } from '@/store/theme-store'
import { NotificationBell } from '@/components/notification-bell'
import { NotificationDropdown } from '@/features/notifications/components/notification-dropdown'
import {
  LayoutDashboard,
  Send,
  Briefcase,
  Heart,
  FileText,
  User,
  Calendar,
  History,
  Gift,
  Bell,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
  { label: 'My Applications', icon: Send, path: '/candidate/applications' },
  { label: 'Job Search', icon: Briefcase, path: '/candidate/jobs' },
  { label: 'Saved Jobs', icon: Heart, path: '/candidate/saved-jobs' },
  { label: 'Resume', icon: FileText, path: '/candidate/resume' },
  { label: 'Profile', icon: User, path: '/candidate/profile' },
  { label: 'Interviews', icon: Calendar, path: '/candidate/interviews' },
  { label: 'Interview History', icon: History, path: '/candidate/interview-history' },
  { label: 'Offers', icon: Gift, path: '/candidate/offers' },
  { label: 'Notifications', icon: Bell, path: '/candidate/notifications' },
  { label: 'Settings', icon: Settings, path: '/candidate/settings' },
]

export function CandidateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

  const resolvedTheme = theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-card">
        <div className="flex h-16 items-center border-b px-4">
          <Link to="/candidate/dashboard">
            <Logo size="sm" />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card p-4">
            <div className="mb-6 flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main area */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-xl px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="w-64 h-9 text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="relative">
              <NotificationBell onClick={() => setShowNotifications(!showNotifications)} />
              {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
