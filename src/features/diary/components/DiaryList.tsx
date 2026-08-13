import { ArrowDownWideNarrow, ArrowUpWideNarrow, BookOpen, ChevronLeft, ChevronRight, LayoutGrid, List, Search, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { STORAGE_KEYS } from '@/app/config/app.config'
import { ROUTES } from '@/app/config/routes'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { useToday } from '@/shared/hooks/useToday'
import { cn } from '@/shared/utils/cn'
import { civil, formatMonthVN } from '@/shared/utils/date'
import { useDiaryCategories } from '../hooks/useDiaryCategories'
import { useDiaryEntriesOfMonth } from '../hooks/useDiaryEntries'
import { useDiarySearch } from '../hooks/useDiarySearch'
import { useDiaryTags } from '../hooks/useDiaryTags'
import type { DiaryEntry } from '../types/diary'
import { DiaryCard } from './DiaryCard'

type ViewMode = 'list' | 'grid'
type SortOrder = 'newest' | 'oldest'

export function DiaryList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const today = useToday()
  const [cursor, setCursor] = useState({ year: today.year, month: today.month })
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<string>>(new Set())
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(STORAGE_KEYS.diaryListView, 'list')
  const { entries, isLoading } = useDiaryEntriesOfMonth(cursor.year, cursor.month)
  const { results, isSearching } = useDiarySearch(query)
  const tags = useDiaryTags()
  const { categories } = useDiaryCategories()

  const shiftMonth = (delta: number) => {
    setCursor((prev) => {
      const total = prev.year * 12 + (prev.month - 1) + delta
      return { year: Math.floor(total / 12), month: (total % 12) + 1 }
    })
  }

  const toggleCategory = (id: string) => {
    setActiveCategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const applyFilters = useCallback(
    (list: DiaryEntry[]) => {
      const byTag = activeTag ? list.filter((entry) => entry.tags.includes(activeTag)) : list
      const byCategory =
        activeCategoryIds.size > 0
          ? byTag.filter((entry) => entry.categoryId && activeCategoryIds.has(entry.categoryId))
          : byTag
      return [...byCategory].sort((a, b) =>
        sortOrder === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
      )
    },
    [activeTag, activeCategoryIds, sortOrder],
  )

  const visibleEntries = useMemo(() => applyFilters(entries), [entries, applyFilters])
  const visibleResults = useMemo(() => applyFilters(results), [results, applyFilters])

  const isSearchMode = query.trim().length > 0
  const open = (id: string) => navigate(ROUTES.diaryEntry(id))

  const listClassName =
    viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface-2 border-border flex items-center gap-2 rounded-2xl border px-3.5">
        <Search className="text-subtle size-4 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('diary.searchPlaceholder')}
          className="text-text h-11 w-full bg-transparent text-sm outline-none"
        />
        {query ? (
          <button type="button" onClick={() => setQuery('')} aria-label={t('diary.clearSearch')} className="text-subtle shrink-0">
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
          aria-label={sortOrder === 'newest' ? t('diary.sortingNewest') : t('diary.sortingOldest')}
          title={sortOrder === 'newest' ? t('diary.sortNewest') : t('diary.sortOldest')}
        >
          {sortOrder === 'newest' ? <ArrowDownWideNarrow className="size-4.5" /> : <ArrowUpWideNarrow className="size-4.5" />}
        </Button>

        <div className="bg-surface-2 border-border inline-flex items-center rounded-xl border p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label={t('diary.viewList')}
            aria-pressed={viewMode === 'list'}
            className={cn(
              'rounded-lg p-1.5 transition-colors',
              viewMode === 'list' ? 'bg-surface text-text shadow-soft' : 'text-subtle',
            )}
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label={t('diary.viewGrid')}
            aria-pressed={viewMode === 'grid'}
            className={cn(
              'rounded-lg p-1.5 transition-colors',
              viewMode === 'grid' ? 'bg-surface text-text shadow-soft' : 'text-subtle',
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={cn(
                'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                activeCategoryIds.has(category.id)
                  ? 'bg-primary text-primary-fg'
                  : 'bg-surface-2 text-muted hover:bg-surface-3',
              )}
            >
              {category.emoji ? `${category.emoji} ` : ''}
              {category.name}
            </button>
          ))}
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
              className={cn(
                'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                activeTag === tag ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted hover:bg-surface-3',
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}

      {isSearchMode ? (
        visibleResults.length === 0 ? (
          <p className="text-subtle py-8 text-center text-sm">
            {isSearching ? t('diary.searching') : t('diary.noResults')}
          </p>
        ) : (
          <div className={listClassName}>
            {visibleResults.map((entry) => (
              <DiaryCard key={entry.id} entry={entry} onSelect={(selected) => open(selected.id)} />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(-1)} aria-label={t('widgets.previousMonth')}>
              <ChevronLeft className="size-4.5" />
            </Button>
            <p className="text-text text-sm font-semibold">{formatMonthVN(civil(cursor.year, cursor.month, 1))}</p>
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(1)} aria-label={t('widgets.nextMonth')}>
              <ChevronRight className="size-4.5" />
            </Button>
          </div>

          {visibleEntries.length === 0 ? (
            isLoading ? (
              <p className="text-subtle py-8 text-center text-sm">{t('common.loading')}</p>
            ) : (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title={t('diary.noEntries')}
                description={
                  activeTag || activeCategoryIds.size > 0
                    ? t('diary.noEntriesFiltered')
                    : t('diary.noEntriesEmpty')
                }
              />
            )
          ) : (
            <div className={listClassName}>
              {visibleEntries.map((entry) => (
                <DiaryCard key={entry.id} entry={entry} onSelect={(selected) => open(selected.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
