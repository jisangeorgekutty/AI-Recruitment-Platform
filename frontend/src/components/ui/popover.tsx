import { type ReactNode, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end' | 'center'
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ trigger, children, align = 'center', className, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setOpen])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            className={cn(
              'absolute z-50 mt-1 rounded-xl border bg-card p-4 shadow-lg',
              align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2',
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
