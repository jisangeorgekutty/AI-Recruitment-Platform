import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Gift, Download, Check, X, Clock, DollarSign, Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { offerService } from '@/services/offer.service'

export default function CandidateOffersPage() {
  const queryClient = useQueryClient()

  const { data: offers, isLoading, error, refetch } = useQuery({
    queryKey: ['candidate-offers'],
    queryFn: offerService.getMyOffers,
  })

  const respondMutation = useMutation({
    mutationFn: ({ applicationId, response }: { applicationId: number; response: 'Accepted' | 'Declined' }) =>
      offerService.respondToOffer(applicationId, response),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidate-offers'] })
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] })
      toast.success(
        variables.response === 'Accepted' ? 'Offer accepted! Congratulations!' : 'Offer declined.'
      )
    },
    onError: () => {
      toast.error('Failed to submit offer response.')
    },
  })

  const handleAction = (applicationId: number, action: 'Accepted' | 'Declined') => {
    respondMutation.mutate({ applicationId, response: action })
  }

  const handleDownloadPdf = (offer: any) => {
    toast.success(`Downloading offer letter for ${offer.jobTitle}...`)
  }

  if (error) return <ErrorState onRetry={refetch} />

  const list = offers ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Offer Letters" description="Review and manage your formal job offers" />

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Gift className="h-12 w-12" />}
          title="No offers yet"
          description="Offers will appear here when companies extend job offers to you."
        />
      ) : (
        <div className="space-y-4">
          {list.map((offer) => {
            const isPending = offer.status === 'Pending'
            const isAccepted = offer.status === 'Accepted'
            const isDeclined = offer.status === 'Declined'

            return (
              <Card key={offer.id} className="transition-all hover:shadow-md border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={offer.companyName} src={offer.companyLogoUrl} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold truncate">{offer.jobTitle}</h3>
                        <Badge
                          variant={
                            isAccepted ? 'success' : isDeclined ? 'destructive' : 'warning'
                          }
                        >
                          {offer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{offer.companyName}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          {offer.currency} {offer.offeredSalary?.toLocaleString()}/{offer.salaryPeriod || 'year'}
                        </span>
                        {offer.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {offer.location}
                          </span>
                        )}
                        {offer.proposedStartDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                            Start: {formatDate(offer.proposedStartDate, 'short')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          Expires {formatDate(offer.expiresAt, 'short')}
                        </span>
                      </div>

                      {offer.recruiterNotes && (
                        <p className="mt-3 text-xs bg-muted/40 p-3 rounded-lg border text-muted-foreground">
                          <strong className="text-foreground">Message from recruiter: </strong>
                          {offer.recruiterNotes}
                        </p>
                      )}

                      <Separator className="my-3" />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPdf(offer)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Offer PDF
                        </Button>

                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                              onClick={() => handleAction(offer.jobApplicationId, 'Accepted')}
                              disabled={respondMutation.isPending}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(offer.jobApplicationId, 'Declined')}
                              disabled={respondMutation.isPending}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Decline Offer
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
