import { forwardRef, type HTMLAttributes, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  className,
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'relative z-50 w-full rounded-2xl border bg-card p-6 shadow-2xl',
              sizeClasses[size],
              'mx-4 max-h-[85vh] overflow-y-auto',
              className,
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  ),
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 mt-6', className)}
      {...props}
    />
  ),
)
DialogFooter.displayName = 'DialogFooter'

export { Dialog, DialogHeader, DialogFooter }
