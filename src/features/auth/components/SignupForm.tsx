import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/app/config/routes'
import { signUpWithPassword } from '@/features/auth/services/auth.service'
import { toAuthErrorMessage } from '@/features/auth/types/auth'
import { Button } from '@/shared/components/ui/Button'
import { AuthTextField } from './AuthTextField'
import { GoogleSignInButton } from './GoogleSignInButton'

export function SignupForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    setIsSubmitting(true)
    try {
      const { confirmed } = await signUpWithPassword(email, password, displayName)
      if (confirmed) {
        const from = (location.state as { from?: string } | null)?.from
        navigate(from ?? '/', { replace: true })
      } else {
        setAwaitingConfirmation(true)
      }
    } catch (err) {
      setError(toAuthErrorMessage(err, t))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (awaitingConfirmation) {
    return (
      <p className="text-text text-sm">
        {t('auth.confirmationSentBefore')} <strong>{email}</strong>. {t('auth.confirmationSentAfter')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleSignInButton onError={setError} />

      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-subtle text-xs">{t('auth.or')}</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <AuthTextField
          label={t('auth.displayName')}
          name="displayName"
          autoComplete="name"
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <AuthTextField
          label={t('auth.email')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthTextField
          label={t('auth.password')}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AuthTextField
          label={t('auth.confirmPassword')}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {error ? <p className="text-primary text-sm">{error}</p> : null}

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? t('auth.signingUp') : t('auth.signUp')}
        </Button>

        <p className="text-muted text-center text-sm">
          {t('auth.haveAccount')}{' '}
          <Link to={ROUTES.authLogin} className="text-primary font-medium">
            {t('auth.signIn')}
          </Link>
        </p>
      </form>
    </div>
  )
}
