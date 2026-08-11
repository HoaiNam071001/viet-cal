import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      {icon ? (
        <div className="bg-surface-2 text-subtle mb-4 grid size-14 place-items-center rounded-2xl">
          {icon}
        </div>
      ) : null}
      <p className="text-text text-[15px] font-medium">{title}</p>
      {description ? <p className="text-muted mt-1 max-w-[38ch] text-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
