import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { Edit, Users, DollarSign, Zap, Plus, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService, type SubscriptionPlan } from '@/services/admin.service'
import { useAdminStore } from '@/store/admin-store'

export default function AdminPlansPage() {
  const queryClient = useQueryClient()
  const { plans, setPlans } = useAdminStore()

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [maxUsers, setMaxUsers] = useState<number>(10)
  const [maxJobs, setMaxJobs] = useState<number>(3)
  const [badgeColor, setBadgeColor] = useState('text-blue-600 bg-blue-100')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: fetchedPlans, isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: adminService.getPlans,
  })

  useEffect(() => {
    if (fetchedPlans) {
      setPlans(fetchedPlans)
    }
  }, [fetchedPlans, setPlans])

  const openCreateModal = () => {
    setEditingPlanId(null)
    setName('')
    setPrice(0)
    setBillingCycle('monthly')
    setMaxUsers(10)
    setMaxJobs(3)
    setBadgeColor('text-blue-600 bg-blue-100')
    setDisplayOrder(plans.length + 1)
    setFeatures(['Basic Job Posting', 'Email Support'])
    setFeatureInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id)
    setName(plan.name)
    setPrice(plan.price)
    setBillingCycle(plan.billingCycle || 'monthly')
    setMaxUsers(plan.maxUsers)
    setMaxJobs(plan.maxJobs)
    setBadgeColor(plan.badgeColor || 'text-blue-600 bg-blue-100')
    setDisplayOrder(plan.displayOrder || 1)
    setFeatures(plan.features || [])
    setFeatureInput('')
    setIsModalOpen(true)
  }

  const handleAddFeature = () => {
    if (!featureInput.trim()) return
    setFeatures([...features, featureInput.trim()])
    setFeatureInput('')
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a plan name')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingPlanId) {
        await adminService.updatePlan(editingPlanId, {
          name,
          price,
          billingCycle,
          maxUsers,
          maxJobs,
          features,
          badgeColor,
          displayOrder,
        })
        toast.success(`Plan "${name}" updated successfully`)
      } else {
        await adminService.createPlan({
          name,
          price,
          billingCycle,
          maxUsers,
          maxJobs,
          features,
          badgeColor,
          displayOrder,
        })
        toast.success(`Plan "${name}" created successfully`)
      }

      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      queryClient.invalidateQueries({ queryKey: ['public-plans'] })
    } catch {
      toast.error('Failed to save subscription plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number, planName: string) => {
    if (!confirm(`Are you sure you want to delete the plan "${planName}"?`)) return
    try {
      await adminService.deletePlan(id)
      toast.success(`Plan "${planName}" deleted`)
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      queryClient.invalidateQueries({ queryKey: ['public-plans'] })
    } catch {
      toast.error('Failed to delete subscription plan')
    }
  }

  const list = plans.length > 0 ? plans : fetchedPlans ?? [
    { id: 1, name: 'Free', price: 0, billingCycle: 'monthly', maxUsers: 10, maxJobs: 3, features: ['Basic job posting', 'Email support'], subscribersCount: 584, badgeColor: 'text-gray-600 bg-gray-100', displayOrder: 1 },
    { id: 2, name: 'Professional', price: 49, billingCycle: 'monthly', maxUsers: 50, maxJobs: 25, features: ['Unlimited job posting', 'AI matching', 'Priority support'], subscribersCount: 312, badgeColor: 'text-blue-600 bg-blue-100', displayOrder: 2 },
    { id: 3, name: 'Enterprise', price: 199, billingCycle: 'monthly', maxUsers: 500, maxJobs: 500, features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA'], subscribersCount: 48, badgeColor: 'text-violet-600 bg-violet-100', displayOrder: 3 },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Plans & Pricing"
        description="Manage subscription plans and tier limits"
        actions={
          <Button onClick={openCreateModal} className="font-medium">
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full text-muted-foreground text-center py-8">Loading plans...</p>
        ) : (
          list.map((p) => (
            <Card key={p.id} className="relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-2 ${p.badgeColor || 'text-blue-600 bg-blue-100'}`}>
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold">{p.name}</h3>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(p.id, p.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-3xl font-bold mb-4">
                  ${p.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {p.price > 0 ? `/${p.billingCycle || 'month'}` : ''}
                  </span>
                </p>

                <div className="space-y-2 text-xs text-muted-foreground mb-4 border-y py-3">
                  <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary" /> Up to {p.maxUsers} users</p>
                  <p className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-primary" /> Up to {p.maxJobs} active jobs</p>
                </div>

                <div className="space-y-2 mb-6">
                  {p.features?.map((f) => (
                    <p key={f} className="text-xs flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge variant="outline">{p.subscribersCount || 0} subscribers</Badge>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(p)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create / Edit Plan Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlanId ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
        description={editingPlanId ? 'Update pricing limits and features for this tier.' : 'Define a new subscription plan for platform recruiters.'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Plan Name</label>
              <Input
                placeholder="e.g. Pro Growth"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Price ($ USD)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Billing Cycle</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Max Users</label>
              <Input
                type="number"
                min="1"
                value={maxUsers}
                onChange={(e) => setMaxUsers(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Max Active Jobs</label>
              <Input
                type="number"
                min="1"
                value={maxJobs}
                onChange={(e) => setMaxJobs(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Badge Accent Style</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
              >
                <option value="text-gray-600 bg-gray-100">Gray / Free Style</option>
                <option value="text-blue-600 bg-blue-100">Blue / Pro Style</option>
                <option value="text-violet-600 bg-violet-100">Violet / Enterprise Style</option>
                <option value="text-emerald-600 bg-emerald-100">Emerald / Growth Style</option>
                <option value="text-amber-600 bg-amber-100">Amber / Gold Style</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Display Order</label>
              <Input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Plan Features</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add feature (e.g. AI Match Score)"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddFeature}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((f, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1.5 py-1 px-3">
                  <span>{f}</span>
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveFeature(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingPlanId ? 'Save Changes' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </motion.div>
  )
}
