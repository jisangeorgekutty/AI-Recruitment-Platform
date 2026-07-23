import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { Search, Download, Receipt, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const payments = [
  { id: 'INV-001', company: 'Google', amount: '$199.00', plan: 'Enterprise', status: 'paid', date: '2026-07-15', method: 'Visa •••• 4242' },
  { id: 'INV-002', company: 'Stripe', amount: '$49.00', plan: 'Professional', status: 'paid', date: '2026-07-14', method: 'Mastercard •••• 8888' },
  { id: 'INV-003', company: 'Figma', amount: '$49.00', plan: 'Professional', status: 'pending', date: '2026-07-20', method: 'Visa •••• 1234' },
  { id: 'INV-004', company: 'StartupXYZ', amount: '$0.00', plan: 'Free', status: 'free', date: '2026-07-10', method: '-' },
  { id: 'INV-005', company: 'Netflix', amount: '$199.00', plan: 'Enterprise', status: 'overdue', date: '2026-06-28', method: 'Amex •••• 9999' },
]

export default function AdminPaymentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Payments" description="Transaction history and invoices" />
      <div className="relative max-w-sm"><Input placeholder="Search transactions..." className="pl-9" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b"><tr>{['Invoice', 'Company', 'Amount', 'Plan', 'Status', 'Date', 'Method', ''].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">{p.company}</td>
                  <td className="px-4 py-3">{p.amount}</td>
                  <td className="px-4 py-3">{p.plan}</td>
                  <td className="px-4 py-3"><Badge variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : p.status === 'overdue' ? 'destructive' : 'outline'}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.date, 'short')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                  <td className="px-4 py-3">{p.status !== 'free' && <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </motion.div>
  )
}
