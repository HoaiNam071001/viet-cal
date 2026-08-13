import { useTranslation } from 'react-i18next'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { Card } from '@/shared/components/ui/Card'

export function SignupPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-text mb-1 text-xl font-semibold">{t('auth.signupTitle')}</h1>
      <p className="text-muted mb-5 text-sm">{t('auth.signupSubtitle')}</p>
      <Card className="p-5">
        <SignupForm />
      </Card>
    </div>
  )
}
