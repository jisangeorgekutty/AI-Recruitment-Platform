import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeClasses = {
  sm: { container: 'h-8', icon: 'h-5 w-5', text: 'text-lg' },
  md: { container: 'h-10', icon: 'h-6 w-6', text: 'text-xl' },
  lg: { container: 'h-12', icon: 'h-8 w-8', text: 'text-2xl' },
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const s = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-2', s.container, className)}>
      <div className="relative flex items-center justify-center rounded-xl bg-primary p-1.5">
        <Sparkles className={cn('text-primary-foreground', s.icon)} />
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight', s.text)}>
          HireGen <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  )
}
