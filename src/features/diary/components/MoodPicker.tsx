import { cn } from '@/shared/utils/cn'

const MOODS: Array<{ emoji: string; label: string }> = [
  { emoji: '😊', label: 'Vui' },
  { emoji: '😔', label: 'Buồn' },
  { emoji: '😍', label: 'Yêu thích' },
  { emoji: '😤', label: 'Bực' },
  { emoji: '😴', label: 'Mệt' },
  { emoji: '🤔', label: 'Suy nghĩ' },
]

interface MoodPickerProps {
  emoji: string | null
  intensity: number | null
  onChange: (emoji: string | null, intensity: number | null) => void
}

export function MoodPicker({ emoji, intensity, onChange }: MoodPickerProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.emoji}
            type="button"
            aria-label={mood.label}
            aria-pressed={emoji === mood.emoji}
            onClick={() => onChange(emoji === mood.emoji ? null : mood.emoji, emoji === mood.emoji ? null : 3)}
            className={cn(
              'flex size-11 items-center justify-center rounded-2xl text-xl transition-colors',
              emoji === mood.emoji ? 'bg-primary-soft ring-primary ring-2' : 'bg-surface-2 hover:bg-surface-3',
            )}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      {emoji ? (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-subtle mr-1 text-xs">Mức độ</span>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              aria-label={`Mức ${level}/5`}
              onClick={() => onChange(emoji, level)}
              className={cn('size-3.5 rounded-full', (intensity ?? 3) >= level ? 'bg-primary' : 'bg-surface-3')}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
