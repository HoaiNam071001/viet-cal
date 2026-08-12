import { BookOpen, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { useToday } from '@/shared/hooks/useToday'
import { cn } from '@/shared/utils/cn'
import { useDiaryEntriesOfMonth } from '../hooks/useDiaryEntries'
import { useDiarySearch } from '../hooks/useDiarySearch'
import { useDiaryTags } from '../hooks/useDiaryTags'
import type { DiaryEntry } from '../types/diary'
import { DiaryCard } from './DiaryCard'

export function DiaryList() {
  const navigate = useNavigate()
  const today = useToday()
  const [cursor, setCursor] = useState({ year: today.year, month: today.month })
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { entries, isLoading } = useDiaryEntriesOfMonth(cursor.year, cursor.month)
  const { results, isSearching } = useDiarySearch(query)
  const tags = useDiaryTags()

  const shiftMonth = (delta: number) => {
    setCursor((prev) => {
      const total = prev.year * 12 + (prev.month - 1) + delta
      return { year: Math.floor(total / 12), month: (total % 12) + 1 }
    })
  }

  const byTag = (list: DiaryEntry[]) => (activeTag ? list.filter((entry) => entry.tags.includes(activeTag)) : list)
  const visibleEntries = byTag(entries)
  const visibleResults = byTag(results)

  const isSearchMode = query.trim().length > 0
  const open = (id: string) => navigate(`/diary/${id}`)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface-2 border-border flex items-center gap-2 rounded-2xl border px-3.5">
        <Search className="text-subtle size-4 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm trong nhật ký…"
          className="text-text h-11 w-full bg-transparent text-sm outline-none"
        />
        {query ? (
          <button type="button" onClick={() => setQuery('')} aria-label="Xoá tìm kiếm" className="text-subtle shrink-0">
            <X className="size-4" />
          </button>
        ) : null}
      </div>

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
            {isSearching ? 'Đang tìm…' : 'Không tìm thấy nhật ký nào.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visibleResults.map((entry) => (
              <DiaryCard key={entry.id} entry={entry} onSelect={(selected) => open(selected.id)} />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(-1)} aria-label="Tháng trước">
              <ChevronLeft className="size-4.5" />
            </Button>
            <p className="text-text text-sm font-semibold">
              Tháng {cursor.month}, {cursor.year}
            </p>
            <Button variant="ghost" size="icon-sm" onClick={() => shiftMonth(1)} aria-label="Tháng sau">
              <ChevronRight className="size-4.5" />
            </Button>
          </div>

          {visibleEntries.length === 0 ? (
            isLoading ? (
              <p className="text-subtle py-8 text-center text-sm">Đang tải…</p>
            ) : (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title="Chưa có nhật ký"
                description={
                  activeTag
                    ? `Không có nhật ký nào gắn thẻ #${activeTag} trong tháng này.`
                    : 'Bấm nút bên dưới để viết nhật ký đầu tiên trong tháng này.'
                }
              />
            )
          ) : (
            <div className="flex flex-col gap-2.5">
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
