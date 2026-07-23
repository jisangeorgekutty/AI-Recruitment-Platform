import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { HiringFunnel } from '@/services/analytics.service'

interface HiringFunnelProps {
  data: HiringFunnel[]
  isLoading: boolean
}

export function HiringFunnelChart({ data, isLoading }: HiringFunnelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Hiring Funnel</CardTitle></CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card>
      <CardHeader><CardTitle>Hiring Funnel</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((stage) => {
            const width = (stage.count / maxCount) * 100
            return (
              <div key={stage.stage} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-right">{stage.stage}</span>
                <div className="flex-1">
                  <div
                    className="h-8 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                    style={{
                      width: `${Math.max(width, 2)}%`,
                      backgroundColor: stage.color,
                    }}
                  >
                    <span className="text-xs font-medium text-white">{stage.count}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
