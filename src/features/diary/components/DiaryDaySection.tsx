import { NotebookPen } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/app/config/routes'
import { Button } from '@/shared/components/ui/Button'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import { useDiaryEntryOfDate } from '../hooks/useDiaryEntries'

/** The "Nhật ký" block inside the day detail — write/preview/open, per sign-in state. */
export function DiaryDaySection({ date }: { date: CivilDate }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const entry = useDiaryEntryOfDate(date)

  if (!user) {
    return (
      <p className="text-subtle text-sm">
        <Link to={ROUTES.authLogin} className="text-primary font-medium">
          {t('auth.signIn')}
        </Link>{' '}
        {t('diary.signInPrompt')}
      </p>
    )
  }

  if (!entry) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(ROUTES.diaryNew(toKey(date)))}
        className="gap-1.5"
      >
        <NotebookPen className="size-4" />
        {t('diary.writeEntry')}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.diaryEntry(entry.id))}
      className="bg-surface-2 hover:bg-surface-3 w-full rounded-2xl px-3.5 py-3 text-left transition-colors"
    >
      <div className="flex items-center gap-2">
        {entry.moodEmoji ? <span className="text-lg leading-none">{entry.moodEmoji}</span> : null}
        <p className="text-text text-sm font-medium">{entry.title || t('nav.diary')}</p>
      </div>
      {entry.content ? <p className="text-muted mt-1 line-clamp-2 text-xs">{entry.content}</p> : null}
    </button>
  )
}
