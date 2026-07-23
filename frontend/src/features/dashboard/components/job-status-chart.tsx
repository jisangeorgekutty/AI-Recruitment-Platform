import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface JobStatusData {
  name: string
  value: number
  color: string
}

interface JobStatusChartProps {
  data: JobStatusData[]
  isLoading: boolean
}

export function JobStatusChart({ data, isLoading }: JobStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
                    backgroundColor: item.color,
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
