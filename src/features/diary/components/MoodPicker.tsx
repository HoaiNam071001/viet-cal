import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

const MOOD_EMOJIS = ['😊', '😔', '😍', '😤', '😴', '🤔'] as const
const MOOD_KEYS = ['happy', 'sad', 'loved', 'frustrated', 'tired', 'thinking'] as const

interface MoodPickerProps {
  emoji: string | null
  intensity: number | null
  onChange: (emoji: string | null, intensity: number | null) => void
}

export function MoodPicker({ emoji, intensity, onChange }: MoodPickerProps) {
  const { t } = useTranslation()
  const moods = MOOD_EMOJIS.map((moodEmoji, index) => ({
    emoji: moodEmoji,
    label: t(`diary.moods.${MOOD_KEYS[index]}`),
  }))

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
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
          <span className="text-subtle mr-1 text-xs">{t('diary.moodLevel')}</span>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              aria-label={t('diary.moodLevelAria', { level })}
              onClick={() => onChange(emoji, level)}
              className={cn('size-3.5 rounded-full', (intensity ?? 3) >= level ? 'bg-primary' : 'bg-surface-3')}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
