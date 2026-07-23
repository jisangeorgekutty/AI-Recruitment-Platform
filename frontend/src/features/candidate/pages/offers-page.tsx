import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Gift, Download, Check, X, Clock, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

const offers = [
  { id: '1', company: 'Figma', role: 'Product Designer', salary: '$145,000/year', offeredDate: '2026-07-20', expiresAt: '2026-08-03', status: 'pending' as const },
]

export default function CandidateOffersPage() {
  const [offerStatuses, setOfferStatuses] = useState<Record<string, string>>({})

  const handleAction = (id: string, action: 'accepted' | 'rejected') => {
    setOfferStatuses({ ...offerStatuses, [id]: action })
    toast.success(action === 'accepted' ? 'Offer accepted! Congratulations!' : 'Offer declined.')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Offer Letters" description="Review and manage your offers" />
      {offers.length === 0 ? (
        <EmptyState icon={<Gift className="h-12 w-12" />} title="No offers yet" description="Offers will appear here when companies send them" />
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={offer.company} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{offer.role}</h3>
                      <Badge variant={offerStatuses[offer.id] === 'accepted' ? 'success' : offerStatuses[offer.id] === 'rejected' ? 'destructive' : 'warning'}>
                        {offerStatuses[offer.id] ? offerStatuses[offer.id].charAt(0).toUpperCase() + offerStatuses[offer.id].slice(1) : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{offer.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Expires {formatDate(offer.expiresAt, 'short')}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
                      {!offerStatuses[offer.id] && (
                        <>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(offer.id, 'accepted')}><Check className="mr-2 h-4 w-4" />Accept</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(offer.id, 'rejected')}><X className="mr-2 h-4 w-4" />Decline</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
