import { CalendarDays, Moon, PartyPopper, Search } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { Sheet } from '@/shared/components/ui/Sheet'
import type { CivilDate } from '@/shared/types'
import { useSearch } from '../hooks/useSearch'
import type { SearchResult } from '../utils/parse-query'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (date: CivilDate) => void
}

const EXAMPLES = ['15/08/2026', '15 tháng 8', 'Tết 2027', 'rằm tháng 7', 'Trung Thu']

const ICONS: Record<SearchResult['kind'], ReactNode> = {
  date: <CalendarDays className="size-4" />,
  lunar: <Moon className="size-4" />,
  holiday: <PartyPopper className="size-4" />,
}

export function SearchDialog({ open, onClose, onSelect }: SearchDialogProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useSearch(query)

  useEffect(() => {
    if (open) {
      setQuery('')
      // Wait for the sheet animation before stealing focus.
      const id = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(id)
    }
  }, [open])

  const choose = (date: CivilDate) => {
    onSelect(date)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={t('search.title')} desktopVariant="dialog">
      <div className="bg-surface-2 border-border focus-within:border-primary mb-4 flex items-center gap-2.5 rounded-2xl border px-3.5 transition-colors">
        <Search className="text-subtle size-4.5 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search.placeholder')}
          className="text-text placeholder:text-subtle h-12 flex-1 bg-transparent text-[15px] outline-none"
        />
      </div>

      {results.isEmpty ? (
        query.trim() ? (
          <EmptyState
            icon={<Search className="size-6" />}
            title={t('search.notFoundTitle')}
            description={t('search.notFoundDescription')}
          />
        ) : (
          <div>
            <p className="text-subtle mb-2 text-xs">{t('search.suggestions')}</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuery(example)}
                  className="bg-surface-2 text-muted hover:text-text rounded-xl px-3 py-2 text-sm transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4">
          <ResultGroup title={t('search.dates')} results={results.dates} onSelect={choose} />
          <ResultGroup title={t('search.holidays')} results={results.holidays} onSelect={choose} />
        </div>
      )}
    </Sheet>
  )
}

function ResultGroup({
  title,
  results,
  onSelect,
}: {
  title: string
  results: SearchResult[]
  onSelect: (date: CivilDate) => void
}) {
  if (results.length === 0) return null

  return (
    <section>
      <p className="text-subtle mb-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">{title}</p>
      <ul className="flex flex-col gap-1">
        {results.map((result) => (
          <li key={result.id}>
            <button
              type="button"
              onClick={() => onSelect(result.date)}
              className="hover:bg-surface-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors"
            >
              <span className="bg-surface-2 text-muted grid size-9 shrink-0 place-items-center rounded-xl">
                {ICONS[result.kind]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-text block truncate text-sm font-medium">{result.title}</span>
                <span className="text-subtle block truncate text-xs">{result.subtitle}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
