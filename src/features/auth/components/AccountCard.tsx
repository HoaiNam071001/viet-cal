import { KeyRound, LogOut, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/app/config/routes'
import { ChangePasswordSheet } from '@/features/auth/components/ChangePasswordSheet'
import { signOut } from '@/features/auth/services/auth.service'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardHeader } from '@/shared/components/ui/Card'

export function AccountCard() {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false)

  if (isLoading) return null

  if (!user) {
    return (
      <Card>
        <CardHeader title={t('account.title')} icon={<UserIcon className="size-3.5" />} />
        <div className="flex flex-col gap-3 px-5 pt-1 pb-5">
          <p className="text-muted text-sm">{t('account.signInPrompt')}</p>
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={() => navigate(ROUTES.authLogin)}>
              {t('auth.signIn')}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => navigate(ROUTES.authSignup)}>
              {t('auth.signUp')}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email

  const onSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Card>
      <CardHeader title={t('account.title')} icon={<UserIcon className="size-3.5" />} />
      <div className="flex items-center justify-between gap-3 px-5 pt-1 pb-3">
        <div className="min-w-0">
          <p className="text-text truncate text-sm font-medium">{displayName}</p>
          <p className="text-subtle truncate text-xs">{user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onSignOut} disabled={isSigningOut} className="gap-1.5">
          <LogOut className="size-4" />
          {t('auth.signOut')}
        </Button>
      </div>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => setPasswordSheetOpen(true)}
          className="bg-surface-2 hover:bg-surface-3 flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left transition-colors"
        >
          <KeyRound className="text-subtle size-4" />
          <span className="text-text text-sm font-medium">{t('auth.changePassword')}</span>
        </button>
      </div>

      <ChangePasswordSheet open={passwordSheetOpen} onClose={() => setPasswordSheetOpen(false)} />
    </Card>
  )
}
