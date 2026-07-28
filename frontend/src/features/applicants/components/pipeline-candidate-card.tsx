import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sparkles, GripVertical, CheckSquare, Square } from 'lucide-react'
import { useJobMatchStore } from '@/store/job-match-store'
import { useCandidateStore } from '@/store/candidate-store'
import type { Candidate } from '@/types'

interface PipelineCandidateCardProps {
  candidate: Candidate
}

export function PipelineCandidateCard({ candidate }: PipelineCandidateCardProps) {
  const navigate = useNavigate()
  const { openMatchModal } = useJobMatchStore()
  const { comparisonCandidates, toggleComparisonSelection } = useCandidateStore()

  const isCompared = comparisonCandidates.includes(candidate.id)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: { candidate },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  }

  const overallScore = candidate.matchScoreOverall ?? candidate.resumeScore

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border bg-card p-3 transition-all hover:shadow-md hover:border-primary/30 group ${
        isDragging ? 'shadow-lg border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground focus:outline-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleComparisonSelection(candidate.id)
            }}
            className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            title={isCompared ? 'Remove from comparison' : 'Select for comparison'}
          >
            {isCompared ? (
              <CheckSquare className="h-4 w-4 text-primary fill-primary/10" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground/60" />
            )}
          </button>
          <div
            onClick={() => navigate(`/recruiter/candidates/${candidate.id}`)}
            className="cursor-pointer flex items-center gap-2 min-w-0 flex-1"
          >
            <Avatar name={candidate.name} src={candidate.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate hover:underline">{candidate.name}</p>
              <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-indigo-500 hover:bg-indigo-500/15 shrink-0"
          title="AI Match Score Analysis"
          onClick={(e) => {
            e.stopPropagation()
            openMatchModal(Number(candidate.id) || Number(candidate.applicationId) || 1)
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </Button>
      </div>

      {overallScore !== undefined && (
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">AI Match:</span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0.5 font-bold ${
                overallScore >= 80
                  ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400'
                  : overallScore >= 60
                  ? 'border-amber-500/40 text-amber-600 bg-amber-500/10 dark:text-amber-400'
                  : 'border-rose-500/40 text-rose-600 bg-rose-500/10 dark:text-rose-400'
              }`}
            >
              {overallScore}%
            </Badge>
          </div>
          {candidate.jobTitle && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[110px]" title={candidate.jobTitle}>
              {candidate.jobTitle}
            </span>
          )}
        </div>
      )}

      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
