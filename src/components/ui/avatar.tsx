import { forwardRef, type HTMLAttributes } from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', ...props }, ref) => {
    const initials = getInitials(name)

    if (src) {
      return (
        <div
          ref={ref}
          className={cn('relative overflow-hidden rounded-full', sizeClasses[size], className)}
          {...props}
        >
          <img src={src} alt={name} className="h-full w-full object-cover" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {initials}
      </div>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar }
