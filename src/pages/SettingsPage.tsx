import { useTranslation } from 'react-i18next'
import { APP_NAME } from '@/app/config/app.config'
import { SettingsPanel } from '@/features/settings/components/SettingsPanel'

export function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-text mb-1 text-xl font-semibold">{t('settings.title')}</h1>
      <p className="text-muted mb-5 text-sm">{t('settings.subtitle')}</p>
      <SettingsPanel />
      <p className="text-subtle mt-6 text-center text-xs">{t('settings.footer', { appName: APP_NAME })}</p>
    </div>
  )
}
