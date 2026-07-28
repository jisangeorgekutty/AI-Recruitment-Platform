import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'


export function LoadingSkeleton({ type = 'card', count = 3, className }: { type?: 'card' | 'table' | 'list' | 'detail' | 'chart' | 'landing'; count?: number; className?: string }) {
  if (type === 'landing') {
    return (
      <div className={cn('min-h-screen flex flex-col bg-background', className)}>
        {/* Header Skeleton */}
        <header className="border-b bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <div className="hidden md:flex items-center gap-8">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-20 rounded-xl" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        </header>

        {/* Hero Section Skeleton */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Skeleton className="mx-auto h-8 w-56 rounded-full" />
              <Skeleton className="mx-auto h-12 w-4/5 max-w-3xl rounded-2xl md:h-16" />
              <Skeleton className="mx-auto h-12 w-3/5 max-w-2xl rounded-2xl md:h-16" />
              <div className="space-y-2 pt-2">
                <Skeleton className="mx-auto h-4 w-3/4 max-w-xl rounded-md" />
                <Skeleton className="mx-auto h-4 w-1/2 max-w-md rounded-md" />
              </div>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Skeleton className="h-12 w-44 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>

            {/* Dashboard Mockup Hero Skeleton */}
            <div className="mx-auto mt-14 max-w-5xl rounded-2xl border bg-card/50 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 border-b pb-4">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="ml-4 h-5 w-48 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-xl">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-14 rounded-lg" />
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-xl">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-8 w-14 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Features Skeleton */}
            <div className="mt-24 space-y-10">
              <div className="text-center space-y-3">
                <Skeleton className="mx-auto h-8 w-64 rounded-xl" />
                <Skeleton className="mx-auto h-4 w-80 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border p-6 space-y-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-4/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
  if (type === 'table') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-2xl border">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b p-4 last:border-0">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  // Card skeleton (default)
  return (
    <div className={cn('grid gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
