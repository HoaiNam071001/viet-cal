import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Card } from '@/shared/components/ui/Card'

export function LoginPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-text mb-1 text-xl font-semibold">{t('auth.loginTitle')}</h1>
      <p className="text-muted mb-5 text-sm">{t('auth.loginSubtitle')}</p>
      <Card className="p-5">
        <LoginForm />
      </Card>
    </div>
  )
}
