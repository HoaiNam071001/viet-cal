import { X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const value = draft.trim().replace(/^#/, '')
    setDraft('')
    if (value && !tags.includes(value)) onChange([...tags, value])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Backspace' && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="bg-surface-2 border-border flex flex-wrap items-center gap-1.5 rounded-2xl border p-2">
      {tags.map((tag) => (
        <span key={tag} className="bg-surface-3 text-text flex items-center gap-1 rounded-lg px-2 py-1 text-xs">
          #{tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} aria-label={`Xoá thẻ ${tag}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={tags.length ? '' : 'Thêm thẻ…'}
        className="text-text min-w-20 flex-1 bg-transparent px-1 py-1 text-xs outline-none"
      />
    </div>
  )
}
