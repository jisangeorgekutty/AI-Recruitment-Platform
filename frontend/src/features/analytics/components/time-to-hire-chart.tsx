import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TimeToHireData } from '@/services/analytics.service'

interface TimeToHireChartProps {
  data: TimeToHireData[]
  isLoading: boolean
}

export function TimeToHireChart({ data, isLoading }: TimeToHireChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Time to Hire</CardTitle></CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  const maxDays = Math.max(...data.map((d) => d.days), 1)

  return (
    <Card>
      <CardHeader><CardTitle>Time to Hire (Days)</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((item) => {
            const height = (item.days / maxDays) * 100
            return (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{item.days}</span>
                <div
                  className="w-full rounded-lg bg-primary/80 transition-all duration-500"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
