import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function AuthTextField({ label, className, id, ...props }: AuthTextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      <span className="text-subtle text-xs">{label}</span>
      <input
        id={inputId}
        className={cn(
          'bg-surface-2 border-border text-text focus:border-primary h-12 w-full rounded-2xl border px-3.5 text-sm outline-none transition-colors',
          className,
        )}
        {...props}
      />
    </label>
  )
}
