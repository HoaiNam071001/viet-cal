import { useTranslation } from 'react-i18next'
import { formatDateVN, fromKey } from '@/shared/utils/date'
import { cn } from '@/shared/utils/cn'
import type { DiaryStats } from '../hooks/useDiaryStats'

/** GitHub-style activity strip: the last 12 weeks, oldest first, flowing column-by-column. */
export function DiaryHeatmap({ heatmap }: { heatmap: DiaryStats['heatmap'] }) {
  const { t } = useTranslation()
  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {heatmap.map((cell) => {
          const date = fromKey(cell.date)
          return (
            <span
              key={cell.date}
              title={date ? `${formatDateVN(date)}${cell.hasEntry ? t('diary.hasEntrySuffix') : ''}` : cell.date}
              className={cn('size-3 rounded-[3px]', cell.hasEntry ? 'bg-accent' : 'bg-surface-3')}
            />
          )
        })}
      </div>
      <div className="text-subtle mt-2.5 flex items-center gap-1.5 text-[11px]">
        <span className="bg-surface-3 size-2.5 rounded-[2px]" />
        {t('diary.noEntryLegend')}
        <span className="bg-accent ml-2 size-2.5 rounded-[2px]" />
        {t('diary.hasEntryLegend')}
      </div>
    </div>
  )
}
