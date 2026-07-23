import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SourceBreakdown } from '@/services/analytics.service'

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#fb7185']

interface SourceBreakdownProps {
  data: SourceBreakdown[]
  isLoading: boolean
}

export function SourceBreakdownChart({ data, isLoading }: SourceBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Source Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Candidate Sources</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {data.map((source, i) => (
          <div key={source.source} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-medium">{source.source}</span>
              </div>
              <span className="text-muted-foreground">{source.percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${source.percentage}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
