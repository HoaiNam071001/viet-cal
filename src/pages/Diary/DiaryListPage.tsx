import { BarChart3, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/app/config/routes'
import { DiaryDatePickerSheet } from '@/features/diary/components/DiaryDatePickerSheet'
import { DiaryList } from '@/features/diary/components/DiaryList'
import { Button } from '@/shared/components/ui/Button'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'

export function DiaryListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const today = useToday()
  const [pickerOpen, setPickerOpen] = useState(false)

  const startEntry = (date: CivilDate) => {
    setPickerOpen(false)
    navigate(ROUTES.diaryNew(toKey(date)))
  }

  return (
    <div className="relative mx-auto max-w-xl pb-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-text mb-1 text-xl font-semibold">{t('nav.diary')}</h1>
          <p className="text-muted text-sm">{t('diary.subtitle')}</p>
        </div>
        <Button className='lg:absolute lg:top-0 lg:right-13' variant="ghost" size="icon-sm" onClick={() => navigate(ROUTES.diaryAnalytics)} aria-label={t('diary.statsTitle')}>
          <BarChart3 className="size-4.5" />
        </Button>
      </div>

      <DiaryList />

      <Button
        variant="primary"
        size="icon"
        onClick={() => setPickerOpen(true)}
        aria-label={t('diary.writeNewEntry')}
        className="fixed right-4 bottom-20 z-20 shadow-panel lg:absolute lg:top-0 lg:right-0 lg:bottom-auto"
      >
        <Plus className="size-5" />
      </Button>

      <DiaryDatePickerSheet open={pickerOpen} onClose={() => setPickerOpen(false)} today={today} onPick={startEntry} />
    </div>
  )
}
