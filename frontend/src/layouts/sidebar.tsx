import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Building2,
  ChevronLeft,
  CreditCard,
} from 'lucide-react'
import { useUiStore } from '@/store/ui-store'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/recruiter/dashboard' },
  { label: 'Jobs', icon: <Briefcase className="h-4 w-4" />, path: '/recruiter/jobs' },
  { label: 'Candidates', icon: <Users className="h-4 w-4" />, path: '/recruiter/candidates' },
  { label: 'Interviews', icon: <Calendar className="h-4 w-4" />, path: '/recruiter/interviews' },
  { label: 'Resume Parser', icon: <FileText className="h-4 w-4" />, path: '/recruiter/resume-analysis' },
  { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, path: '/recruiter/analytics' },
  { label: 'Company', icon: <Building2 className="h-4 w-4" />, path: '/recruiter/company' },
  { label: 'Billing & Plans', icon: <CreditCard className="h-4 w-4" />, path: '/recruiter/billing' },
  { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/recruiter/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useUiStore()

  return (
    <>
      {/* Mobile overlay */}
      <MobileSidebarOverlay />

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar-background transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16',
        )}
      >
        {/* Logo */}
        <div className={cn('flex h-16 items-center border-b px-4', sidebarOpen ? 'justify-between' : 'justify-center')}>
          <Link to="/dashboard">
            {sidebarOpen ? <Logo size="sm" /> : <Logo size="sm" showText={false} />}
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground hidden md:flex"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  !sidebarOpen && 'justify-center px-2',
                )}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

function MobileSidebarOverlay() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore()

  if (!mobileSidebarOpen) return null

  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)}>
      <aside
        className="h-full w-64 border-r bg-sidebar-background p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <Logo size="sm" />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
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
                onClick={() => setMobileSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
