import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/page-header'
import { Search, SlidersHorizontal, MoreHorizontal, Ban, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const { users, setUsers, updateUserStatus } = useAdminStore()

  const { data: fetchedUsers, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminService.getUsers({ search }),
  })

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers)
    }
  }, [fetchedUsers, setUsers])

  const toggleStatus = async (id: number, current: string) => {
    const nextStatus = current === 'active' ? 'suspended' : 'active'
    try {
      await adminService.updateUserStatus(id, nextStatus)
      updateUserStatus(id, nextStatus)
      toast.success(`User ${nextStatus === 'suspended' ? 'suspended' : 'activated'}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const list = users.length > 0 ? users : fetchedUsers ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Users" description="Manage platform users" />
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" />Filters</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>{['User', 'Role', 'Plan', 'Status', 'Jobs', 'Joined', ''].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading users...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No users found</td></tr>
                ) : (
                  list.map(u => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      <td className="px-4 py-3">{u.plan}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.status === 'active' ? 'success' : 'destructive'}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3">{u.jobsCount}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleStatus(u.id, u.status)}>
                            {u.status === 'active' ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                          </Button>
                          <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
