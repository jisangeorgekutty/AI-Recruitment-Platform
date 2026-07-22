import { Star, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Candidate } from '@/types'

interface TopCandidatesProps {
  candidates: Candidate[]
  isLoading: boolean
}

export function TopCandidates({ candidates, isLoading }: TopCandidatesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Candidates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {candidates.slice(0, 5).map((candidate) => (
          <div key={candidate.id} className="flex items-center gap-3">
            <Avatar name={candidate.name} src={candidate.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{candidate.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
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
            </div>
            <Badge variant={candidate.stage === 'hired' ? 'success' : 'info'}>
              {candidate.stage}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
