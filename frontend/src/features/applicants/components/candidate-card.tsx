import { Link } from 'react-router-dom'
import { Star, MapPin, Briefcase, Sparkles, Award, CheckSquare, Square } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn, formatDate } from '@/lib/utils'
import { STAGE_LABELS } from '../types'
import type { Candidate } from '@/types'
import { useJobMatchStore } from '@/store/job-match-store'
import { useCandidateStore } from '@/store/candidate-store'

interface CandidateCardProps {
  candidate: Candidate
  rank?: number
}

export function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const { openMatchModal } = useJobMatchStore()
  const { comparisonCandidates, toggleComparisonSelection } = useCandidateStore()

  const isCompared = comparisonCandidates.includes(candidate.id)

  const handleMatchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const appId = Number(candidate.id) || Number(candidate.applicationId) || 1
    openMatchModal(appId)
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleComparisonSelection(candidate.id)
  }

  const overallScore = candidate.matchScoreOverall ?? candidate.resumeScore

  const getRankBadge = (r: number) => {
    if (r === 1) {
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-bold text-xs">
          <Award className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          #1 Match
        </Badge>
      )
    }
    if (r === 2) {
      return (
        <Badge className="bg-slate-400/15 text-slate-700 dark:text-slate-300 border-slate-400/30 gap-1 font-bold text-xs">
          <Award className="h-3.5 w-3.5 text-slate-400 fill-slate-400" />
          #2 Match
        </Badge>
      )
    }
    if (r === 3) {
      return (
        <Badge className="bg-amber-700/15 text-amber-700 dark:text-amber-500 border-amber-700/30 gap-1 font-bold text-xs">
          <Award className="h-3.5 w-3.5 text-amber-700 fill-amber-700" />
          #3 Match
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-xs font-semibold">
        #{r} Rank
      </Badge>
    )
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 relative group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleCompareClick}
              className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              title={isCompared ? 'Remove from comparison' : 'Select for comparison'}
            >
              {isCompared ? (
                <CheckSquare className="h-5 w-5 text-primary fill-primary/10" />
              ) : (
                <Square className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground" />
              )}
            </button>
            <Link to={`/recruiter/candidates/${candidate.id}`}>
              <Avatar name={candidate.name} src={candidate.avatar} size="lg" />
            </Link>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/recruiter/candidates/${candidate.id}`} className="hover:underline">
                <h3 className="text-base font-semibold truncate">{candidate.name}</h3>
              </Link>
              {rank && getRankBadge(rank)}
              <div className="flex items-center gap-0.5 ml-auto sm:ml-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < candidate.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{candidate.position}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {candidate.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidate.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Applied {formatDate(candidate.appliedDate, 'relative')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {candidate.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge
              variant={
                candidate.stage === 'hired'
                  ? 'success'
                  : candidate.stage === 'rejected'
                  ? 'destructive'
                  : candidate.stage === 'offer'
                  ? 'warning'
                  : 'info'
              }
            >
              {STAGE_LABELS[candidate.stage] || candidate.stage}
            </Badge>

            {overallScore !== undefined && (
              <Badge
                variant="outline"
                className={`text-xs font-bold ${
                  overallScore >= 80
                    ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                    : overallScore >= 60
                    ? 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                    : 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                }`}
              >
                {overallScore}% Match
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleMatchClick}
              className="text-xs gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Match
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
