import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  error?: string
  label?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
        <select
          id={id}
          className={cn(
            'flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-destructive' : 'border-input',
            className,
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select }
