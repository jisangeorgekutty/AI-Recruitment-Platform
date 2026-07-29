import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { Search, Download, CreditCard } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const { payments, setPayments } = useAdminStore()

  const { data: fetchedPayments, isLoading } = useQuery({
    queryKey: ['admin-payments', search],
    queryFn: () => adminService.getPayments({ search }),
  })

  useEffect(() => {
    if (fetchedPayments) {
      setPayments(fetchedPayments)
    }
  }, [fetchedPayments, setPayments])

  const list = payments.length > 0 ? payments : fetchedPayments ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Payments" description="Transaction history and invoices" />
      <div className="relative max-w-sm">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  {['Invoice / Session ID', 'Company', 'Amount', 'Plan', 'Status', 'Date', 'Method', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading payment transactions...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No payment transactions found
                    </td>
                  </tr>
                ) : (
                  list.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3 font-mono text-xs max-w-[180px] truncate" title={p.id}>{p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.company}</td>
                      <td className="px-4 py-3 font-semibold">{p.amount}</td>
                      <td className="px-4 py-3">{p.plan}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            p.status === 'paid' || p.status === 'succeeded'
                              ? 'success'
                              : p.status === 'pending'
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(p.date, 'short')}</td>
                      <td className="px-4 py-3 text-muted-foreground flex items-center gap-1.5 mt-2">
                        <CreditCard className="h-3.5 w-3.5" />
                        {p.method}
                      </td>
                      <td className="px-4 py-3">
                        {p.status !== 'free' && (
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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
