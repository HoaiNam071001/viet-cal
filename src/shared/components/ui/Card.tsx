import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-surface border-border rounded-3xl border shadow-soft', className)}
      {...props}
    />
  )
}

interface CardHeaderProps {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 pt-4 pb-2', className)}>
      <div className="text-subtle flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
        {icon}
        {title}
      </div>
      {action}
    </div>
  )
}

/** A labelled block inside the day detail — label above, content below. */
export function InfoRow({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-1.5', className)}>
      <span className="text-muted text-sm">{label}</span>
      <span className="text-text text-right text-sm font-medium">{children}</span>
    </div>
  )
}
