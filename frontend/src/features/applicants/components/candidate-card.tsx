import { Link } from 'react-router-dom'
import { Star, MapPin, Briefcase, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn, formatDate } from '@/lib/utils'
import { STAGE_LABELS } from '../types'
import type { Candidate } from '@/types'
import { useJobMatchStore } from '@/store/job-match-store'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { openMatchModal } = useJobMatchStore()

  const handleMatchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const appId = Number(candidate.id) || 1
    openMatchModal(appId)
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 relative group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Link to={`/recruiter/candidates/${candidate.id}`}>
            <Avatar name={candidate.name} src={candidate.avatar} size="lg" />
          </Link>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Link to={`/recruiter/candidates/${candidate.id}`} className="hover:underline">
                <h3 className="text-base font-semibold truncate">{candidate.name}</h3>
              </Link>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < candidate.rating ? 'fill-amber-400 text-amber-400' : 'text-muted',
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
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={
                candidate.stage === 'hired' ? 'success' :
                candidate.stage === 'rejected' ? 'destructive' :
                candidate.stage === 'offer' ? 'warning' : 'info'
              }
            >
              {STAGE_LABELS[candidate.stage]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMatchClick}
              className="text-xs gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Match Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
