import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ErrorState } from '@/components/error-state'
import { candidateService } from '@/services/candidate.service'
import { STAGE_LABELS, STAGE_COLORS } from '@/features/candidates/types'
import type { CandidateStage, Candidate } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

const PIPELINE_STAGES: CandidateStage[] = [
  'sourced', 'applied', 'screened', 'interview', 'technical', 'offer', 'hired',
]

export default function CandidatePipelinePage() {
  const navigate = useNavigate()

  const { data: pipeline, isLoading, error, refetch } = useQuery({
    queryKey: ['candidate-pipeline'],
    queryFn: () => candidateService.getPipeline(),
  })

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Pipeline"
        description="Drag and drop candidates through hiring stages"
        actions={
          <Button variant="outline" onClick={() => navigate('/candidates')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            List View
          </Button>
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
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const candidates = (pipeline?.[stage] ?? []) as Candidate[]
            return (
              <div key={stage} className="min-w-[280px] flex-1">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                        <CardTitle className="text-sm">{STAGE_LABELS[stage]}</CardTitle>
                      </div>
                      <Badge variant="secondary">{candidates.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            onClick={() => navigate(`/candidates/${candidate.id}`)}
                            className="cursor-pointer rounded-xl border p-3 transition-all hover:shadow-sm hover:border-primary/20"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar name={candidate.name} src={candidate.avatar} size="sm" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{candidate.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 2).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-[10px]">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                        {candidates.length === 0 && (
                          <p className="py-8 text-center text-xs text-muted-foreground">No candidates</p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
