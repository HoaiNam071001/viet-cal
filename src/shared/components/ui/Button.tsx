import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

const button = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-all duration-150 select-none disabled:pointer-events-none disabled:opacity-45 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-fg shadow-soft hover:bg-primary-hover',
        secondary: 'bg-surface-2 text-text hover:bg-surface-3 border border-border',
        soft: 'bg-primary-soft text-primary hover:brightness-[0.97]',
        ghost: 'text-muted hover:bg-surface-2 hover:text-text',
        outline: 'border border-border bg-surface text-text hover:bg-surface-2',
      },
      size: {
        sm: 'h-9 rounded-xl px-3 text-[13px]',
        md: 'h-11 rounded-2xl px-4 text-sm',
        lg: 'h-12 rounded-2xl px-5 text-[15px]',
        // 44px minimum touch target on every icon-only control.
        icon: 'size-11 rounded-2xl',
        'icon-sm': 'size-9 rounded-xl',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(button({ variant, size }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  )
}
