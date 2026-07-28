import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Search, Building2, MoreHorizontal, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('')
  const { companies, setCompanies, updateCompanyStatus } = useAdminStore()

  const { data: fetchedCompanies, isLoading } = useQuery({
    queryKey: ['admin-companies', search],
    queryFn: () => adminService.getCompanies({ search }),
  })

  useEffect(() => {
    if (fetchedCompanies) {
      setCompanies(fetchedCompanies)
    }
  }, [fetchedCompanies, setCompanies])

  const handleVerify = async (id: number) => {
    try {
      await adminService.updateCompanyStatus(id, 'verified')
      updateCompanyStatus(id, 'verified')
      toast.success('Company verified')
    } catch {
      toast.error('Failed to verify company')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await adminService.updateCompanyStatus(id, 'rejected')
      updateCompanyStatus(id, 'rejected')
      toast.success('Company rejected')
    } catch {
      toast.error('Failed to reject company')
    }
  }

  const list = companies.length > 0 ? companies : fetchedCompanies ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Companies" description="Manage registered companies" />
      <div className="relative max-w-sm">
        <Input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full text-muted-foreground text-center py-8">Loading companies...</p>
        ) : list.length === 0 ? (
          <p className="col-span-full text-muted-foreground text-center py-8">No companies found</p>
        ) : (
          list.map(c => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-primary/10 p-3"><Building2 className="h-5 w-5 text-primary" /></div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{c.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{c.industry}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <p>{c.email}</p>
                  <p>{c.employees} employees</p>
                  <p>{c.activeJobsCount} active jobs</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={c.status === 'verified' ? 'success' : 'warning'}>{c.status}</Badge>
                  <div className="flex gap-1">
                    {c.status === 'pending' && (
                      <>
                        <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleVerify(c.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleReject(c.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  )
}
