import { useDroppable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PipelineCandidateCard } from './pipeline-candidate-card'
import type { Candidate, CandidateStage } from '@/types'
import { STAGE_LABELS, STAGE_COLORS } from '../types'

interface PipelineColumnProps {
  stage: CandidateStage
  candidates: Candidate[]
}

export function PipelineColumn({ stage, candidates }: PipelineColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  })

  return (
    <div ref={setNodeRef} className="min-w-[280px] flex-1">
      <Card className={`h-full transition-all ${isOver ? 'ring-2 ring-primary border-primary bg-primary/5' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: STAGE_COLORS[stage] || '#818cf8' }}
              />
              <CardTitle className="text-sm font-semibold">{STAGE_LABELS[stage] || stage}</CardTitle>
            </div>
            <Badge variant="secondary" className="font-bold">{candidates.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <ScrollArea className="h-[520px]">
            <div className="space-y-2.5 pr-2 min-h-[480px]">
              {candidates.map((candidate) => (
                <PipelineCandidateCard key={candidate.id} candidate={candidate} />
              ))}
              {candidates.length === 0 && (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground">
                  Drop candidates here
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
