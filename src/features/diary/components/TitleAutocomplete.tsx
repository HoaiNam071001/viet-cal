import { useEffect, useRef, useState } from 'react'
import { DIARY_TITLE_DEFAULT_SUGGESTIONS, DIARY_TITLE_SUGGESTIONS } from '../constants/title-suggestions'

interface TitleAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MAX_MATCHES = 8

/** Free-text title input with a click-to-fill autocomplete dropdown. Matches Vietnamese and
 * English suggestions alike, case-insensitively, regardless of the app's current UI language.
 * Focusing an empty input shows a curated sample before the user types anything. */
export function TitleAutocomplete({ value, onChange, placeholder }: TitleAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const query = value.trim().toLowerCase()
  const matches = query
    ? DIARY_TITLE_SUGGESTIONS.filter((suggestion) => suggestion.toLowerCase().includes(query)).slice(0, MAX_MATCHES)
    : DIARY_TITLE_DEFAULT_SUGGESTIONS

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (suggestion: string) => {
    onChange(suggestion)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-surface-2 border-border text-text focus:border-primary h-12 w-full rounded-2xl border px-3.5 text-base font-medium outline-none transition-colors"
      />
      {open && matches.length > 0 ? (
        <div className="bg-bg-elevated border-border animate-scale-in absolute top-full left-0 z-40 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border p-1.5 shadow-panel">
          {matches.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(suggestion)}
              className="text-text hover:bg-surface-2 block w-full truncate rounded-xl px-3 py-2 text-left text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
