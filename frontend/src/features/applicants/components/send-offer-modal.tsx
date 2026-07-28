import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DollarSign, Gift, Calendar, Clock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { offerService } from '@/services/offer.service'
import type { Candidate } from '@/types'

interface SendOfferModalProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SendOfferModal({ candidate, isOpen, onClose, onSuccess }: SendOfferModalProps) {
  const queryClient = useQueryClient()

  const [salary, setSalary] = useState<string>('')
  const [currency, setCurrency] = useState<string>('USD')
  const [salaryPeriod, setSalaryPeriod] = useState<string>('yearly')
  const [startDate, setStartDate] = useState<string>('')
  const [expiryDays, setExpiryDays] = useState<number>(14)
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    if (candidate) {
      setSalary('135000')
      setCurrency('USD')
      setSalaryPeriod('yearly')
      setExpiryDays(14)
      setNotes('')
    }
  }, [candidate])

  const sendOfferMutation = useMutation({
    mutationFn: (payload: any) => offerService.sendOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success(`Job offer sent to ${candidate?.name}!`)
      onClose()
      if (onSuccess) onSuccess()
    },
    onError: () => {
      toast.error('Failed to generate offer letter.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidate) return

    const appId = Number(candidate.applicationId || candidate.id)

    sendOfferMutation.mutate({
      applicationId: appId,
      offeredSalary: salary ? Number(salary) : undefined,
      currency,
      salaryPeriod,
      proposedStartDate: startDate ? new Date(startDate).toISOString() : undefined,
      expiresInDays: Number(expiryDays),
      recruiterNotes: notes || undefined,
    })
  }

  if (!candidate) return null

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={`Send Job Offer to ${candidate.name}`}
      description={`Generate a formal offer letter for ${candidate.position}. Default values are pre-filled from the job posting.`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Salary Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              Offered Salary
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 135000"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>

        {/* Dates & Expiry Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              Proposed Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              Offer Expiry (Days)
            </label>
            <input
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              min={1}
              max={60}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Recruiter Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Personalized Note to Candidate (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. We were thrilled by your interview performance! Looking forward to having you on the team."
            className="w-full rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5"
            disabled={sendOfferMutation.isPending}
          >
            <Gift className="h-4 w-4" />
            {sendOfferMutation.isPending ? 'Generating Offer...' : 'Send Offer Letter'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
