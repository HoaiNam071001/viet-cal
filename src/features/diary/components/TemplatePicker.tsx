import { DIARY_TEMPLATES, type DiaryTemplateDef } from '../constants/templates'

export function TemplatePicker({ onPick }: { onPick: (template: DiaryTemplateDef) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DIARY_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onPick(template)}
          className="bg-surface-2 hover:bg-surface-3 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
        >
          <span>{template.emoji}</span>
          {template.name}
        </button>
      ))}
    </div>
  )
}
