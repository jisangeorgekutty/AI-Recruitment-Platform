import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { ArrowLeft, Users, Filter, X, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/error-state'
import { candidateService } from '@/services/candidate.service'
import { jobService } from '@/services/job.service'
import { PipelineColumn } from '@/features/applicants/components/pipeline-column'
import { PipelineCandidateCard } from '@/features/applicants/components/pipeline-candidate-card'
import { CandidateMatchModal } from '@/features/applicants/components/candidate-match-modal'
import { SendOfferModal } from '@/features/applicants/components/send-offer-modal'
import { useCandidateStore } from '@/store/candidate-store'
import type { CandidateStage, Candidate } from '@/types'

const PIPELINE_STAGES: CandidateStage[] = [
  'applied',
  'screened',
  'shortlisted',
  'interview',
  'offer',
  'rejected',
]

export default function CandidatePipelinePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { comparisonCandidates, clearComparison, selectedJobId, setSelectedJobId } = useCandidateStore()

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
  const [localPipeline, setLocalPipeline] = useState<Record<string, Candidate[]>>({})
  const [offerModalCandidate, setOfferModalCandidate] = useState<Candidate | null>(null)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)

  // Sensors for DnD (prevent accidental drags when clicking buttons)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  // Fetch jobs for dropdown filter
  const { data: jobsData } = useQuery({
    queryKey: ['jobs-dropdown'],
    queryFn: () => jobService.list({ pageSize: 100 }),
  })
  const jobs = jobsData?.items ?? jobsData?.data ?? []

  // Fetch pipeline data
  const { data: pipelineData, isLoading, error, refetch } = useQuery({
    queryKey: ['candidate-pipeline', selectedJobId],
    queryFn: () => candidateService.getPipeline(selectedJobId || undefined),
  })

  // Sync server data to local pipeline state
  useEffect(() => {
    if (pipelineData) {
      setLocalPipeline(pipelineData)
    }
  }, [pipelineData])

  // Update candidate stage mutation with optimistic rollback
  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: CandidateStage }) => candidateService.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Candidate stage updated!')
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previousPipeline) {
        setLocalPipeline(context.previousPipeline)
      }
      toast.error('Failed to update candidate stage.')
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    const candidate = event.active.data.current?.candidate as Candidate
    if (candidate) {
      setActiveCandidate(candidate)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCandidate(null)

    if (!over) return

    const candidateId = String(active.id)
    const targetStage = String(over.id) as CandidateStage

    // Find source stage
    let sourceStage: string | null = null
    let candidateObj: Candidate | null = null

    for (const [stg, list] of Object.entries(localPipeline)) {
      const found = list.find((c) => c.id === candidateId)
      if (found) {
        sourceStage = stg
        candidateObj = found
        break
      }
    }

    if (!sourceStage || !candidateObj || sourceStage === targetStage) return

    // Optimistic UI update
    const previousPipeline = { ...localPipeline }
    setLocalPipeline((prev) => {
      const updated = { ...prev }
      const sourceList = (updated[sourceStage!] ?? []).filter((c) => c.id !== candidateId)
      const updatedCandidate = { ...candidateObj!, stage: targetStage }
      const targetList = [...(updated[targetStage] ?? []), updatedCandidate]
      return {
        ...updated,
        [sourceStage!]: sourceList,
        [targetStage]: targetList,
      }
    })

    // Execute server update
    updateStageMutation.mutate(
      { id: candidateId, stage: targetStage },
      { context: { previousPipeline } } as any
    )

    // Open offer modal if target is offer
    if (targetStage === 'offer') {
      setOfferModalCandidate(candidateObj)
      setIsOfferModalOpen(true)
    }
  }

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Interactive Hiring Pipeline"
        description="Drag and drop candidates through hiring stages"
        actions={
          <div className="flex items-center gap-3">
            {/* Job Filter Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-card border rounded-lg px-2.5 py-1.5 shadow-sm text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(e.target.value || null)}
                className="bg-card text-foreground text-xs font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100 text-slate-900">
                  All Job Postings
                </option>
                {jobs.map((job: any) => (
                  <option key={job.id} value={String(job.id)} className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100 text-slate-900">
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline" size="sm" onClick={() => navigate('/recruiter/candidates')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              List View
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage} className="min-w-[280px] flex-1">
              <div className="h-96 animate-pulse rounded-2xl bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {PIPELINE_STAGES.map((stage) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                candidates={(localPipeline[stage] ?? []) as Candidate[]}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate ? <PipelineCandidateCard candidate={activeCandidate} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Floating Comparison Action Bar */}
      {comparisonCandidates.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl border"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4" />
            <span>{comparisonCandidates.length} Selected for Comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full font-bold gap-1 text-xs"
              onClick={() => navigate(`/recruiter/candidates/compare`)}
            >
              Compare Side-by-Side
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={clearComparison}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <CandidateMatchModal />
      <SendOfferModal
        candidate={offerModalCandidate}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />
    </motion.div>
  )
}
