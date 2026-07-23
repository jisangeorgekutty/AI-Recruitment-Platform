import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { sidebarOpen } = useUiStore()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={cn(
          'flex flex-1 flex-col overflow-y-auto transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'md:ml-16',
        )}
      >
        <Header />
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
