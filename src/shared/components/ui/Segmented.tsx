import { cn } from '@/shared/utils/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  size?: 'sm' | 'md'
  'aria-label'?: string
}

/** Pill segmented control with a sliding indicator. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'bg-surface-2 border-border relative isolate inline-flex rounded-2xl border p-1',
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-surface shadow-soft absolute inset-y-1 -z-10 rounded-xl transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
          left: '0.25rem',
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 rounded-xl font-medium transition-colors duration-150',
            size === 'md' ? 'h-9 px-4 text-sm' : 'h-8 px-3 text-[13px]',
            option.value === value ? 'text-text' : 'text-muted hover:text-text',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
