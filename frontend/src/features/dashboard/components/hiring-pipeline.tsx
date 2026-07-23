import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface PipelineStage {
  stage: string
  count: number
  color: string
}

interface HiringPipelineProps {
  stages: PipelineStage[]
  isLoading: boolean
}

export function HiringPipeline({ stages, isLoading }: HiringPipelineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...stages.map((s) => s.count), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">{stage.count}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${maxCount > 0 ? (stage.count / maxCount) * 100 : 0}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
