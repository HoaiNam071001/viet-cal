import { BookHeart, ChevronRight, Languages, Monitor, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useSettings, type Settings } from '@/app/providers/SettingsProvider'
import { ROUTES } from '@/app/config/routes'
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/app/config/app.config'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { useAuth } from '@/app/providers/AuthProvider'
import { AccountCard } from '@/features/auth/components/AccountCard'
import { DataExportCard } from '@/features/diary/components/DataExportCard'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Segmented } from '@/shared/components/ui/Segmented'
import type { ThemeMode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const TOGGLE_KEYS: (keyof Settings)[] = [
  'showLunarInGrid',
  'showInternationalHolidays',
  'showAstrology',
  'showDiaryContentPreview',
]

export function SettingsPanel({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const { mode, setMode } = useTheme()
  const { settings, update } = useSettings()
  const { usedRemote, isLoading } = useHolidayContext()
  const { user } = useAuth()
  const navigate = useNavigate()

  const themeOptions = [
    { value: 'light' as const, label: t('settings.appearance.light') },
    { value: 'dark' as const, label: t('settings.appearance.dark') },
    { value: 'system' as const, label: t('settings.appearance.system') },
  ]

  const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang,
    label: lang === 'vi' ? t('settings.language.vietnamese') : t('settings.language.english'),
  }))

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <AccountCard />

      {user ? (
        <>
          <Card>
            <CardHeader title={t('settings.diary.title')} icon={<BookHeart className="size-3.5" />} />
            <div className="px-5 pt-1 pb-5">
              <button
                type="button"
                onClick={() => navigate(ROUTES.diaryCategories)}
                className="bg-surface-2 hover:bg-surface-3 flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors"
              >
                <span className="text-text text-sm font-medium">{t('settings.diary.manageCategories')}</span>
                <ChevronRight className="text-subtle size-4" />
              </button>
            </div>
          </Card>

          <DataExportCard />
        </>
      ) : null}

      <Card>
        <CardHeader title={t('settings.appearance.title')} icon={<Sun className="size-3.5" />} />
        <div className="px-5 pt-1 pb-5">
          <Segmented
            className="flex w-full"
            options={themeOptions}
            value={mode}
            onChange={(next: ThemeMode) => setMode(next)}
            aria-label={t('settings.appearance.title')}
          />
          <div className="text-subtle mt-3 flex items-center gap-2 text-xs">
            {mode === 'system' ? <Monitor className="size-3.5" /> : mode === 'dark' ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            {mode === 'system' ? t('settings.appearance.systemNote') : t('settings.appearance.fixedNote')}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title={t('settings.language.title')} icon={<Languages className="size-3.5" />} />
        <div className="px-5 pt-1 pb-5">
          <Segmented
            className="flex w-full"
            options={languageOptions}
            value={i18n.language as AppLanguage}
            onChange={(next: AppLanguage) => i18n.changeLanguage(next)}
            aria-label={t('settings.language.title')}
          />
          <p className="text-subtle mt-3 text-xs">{t('settings.language.note')}</p>
        </div>
      </Card>

      <Card>
        <CardHeader title={t('settings.display.title')} />
        <div className="flex flex-col px-5 pt-1 pb-4">
          {TOGGLE_KEYS.map((key) => (
            <label
              key={key}
              className="border-border flex cursor-pointer items-center justify-between gap-4 border-b py-3.5 last:border-b-0"
            >
              <span className="min-w-0">
                <span className="text-text block text-sm font-medium">{t(`settings.display.${key}.label`)}</span>
                <span className="text-subtle block text-xs">{t(`settings.display.${key}.description`)}</span>
              </span>
              <Switch checked={settings[key]} onChange={(value) => update(key, value)} label={t(`settings.display.${key}.label`)} />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title={t('settings.holidayData.title')} />
        <div className="text-muted px-5 pt-1 pb-5 text-sm">
          <p>{t('settings.holidayData.description')}</p>
          <p className="text-subtle mt-2 text-xs">
            {t('settings.holidayData.source')} ·{' '}
            {isLoading
              ? t('settings.holidayData.syncing')
              : usedRemote
                ? t('settings.holidayData.synced')
                : t('settings.holidayData.offline')}
          </p>
        </div>
      </Card>
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6.5 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-surface-3',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-5.5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked && 'translate-x-4.5',
        )}
      />
    </button>
  )
}
