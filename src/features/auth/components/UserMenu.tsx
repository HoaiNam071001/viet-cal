import { LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { signOut } from '@/features/auth/services/auth.service'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

/** Account entry point for the desktop header: sign-in CTA when logged out, an
 * avatar button with a dropdown (Settings, sign out) once signed in. */
export function UserMenu() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (isLoading) return null

  if (!user) {
    return (
      <Button variant="primary" size="sm" onClick={() => navigate('/auth/login')}>
        Đăng nhập
      </Button>
    )
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? 'Tài khoản'
  const initial = displayName.charAt(0).toUpperCase()

  const onSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      setOpen(false)
      navigate('/')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tài khoản"
        className="bg-primary-soft text-primary grid size-9 place-items-center rounded-full text-sm font-semibold"
      >
        {initial}
      </button>

      {open ? (
        <div
          role="menu"
          className="bg-bg-elevated border-border animate-scale-in absolute top-full right-0 z-40 mt-2 w-56 origin-top-right rounded-2xl border p-1.5 shadow-panel"
        >
          <div className="px-3 py-2">
            <p className="text-text truncate text-sm font-medium">{displayName}</p>
            {user.email ? <p className="text-subtle truncate text-xs">{user.email}</p> : null}
          </div>
          <div className="bg-border my-1 h-px" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              navigate('/settings')
            }}
            className="text-text hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm"
          >
            <Settings className="size-4" />
            Cài đặt
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            disabled={isSigningOut}
            className={cn(
              'text-text hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm',
              isSigningOut && 'opacity-60',
            )}
          >
            <LogOut className="size-4" />
            {isSigningOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
