import { BookHeart, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useSettings, type Settings } from '@/app/providers/SettingsProvider'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { useAuth } from '@/app/providers/AuthProvider'
import { AccountCard } from '@/features/auth/components/AccountCard'
import { CategoryManager } from '@/features/diary/components/CategoryManager'
import { DataExportCard } from '@/features/diary/components/DataExportCard'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Segmented } from '@/shared/components/ui/Segmented'
import type { ThemeMode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Sáng' },
  { value: 'dark' as const, label: 'Tối' },
  { value: 'system' as const, label: 'Hệ thống' },
]

const TOGGLES: Array<{ key: keyof Settings; label: string; description: string }> = [
  {
    key: 'showLunarInGrid',
    label: 'Hiện ngày Âm trong lịch tháng',
    description: 'Số nhỏ bên dưới ngày Dương.',
  },
  {
    key: 'showInternationalHolidays',
    label: 'Hiện ngày lễ quốc tế',
    description: 'Valentine, Halloween, Giáng sinh…',
  },
  {
    key: 'showAstrology',
    label: 'Hiện tiết khí & giờ hoàng đạo',
    description: 'Thông tin lịch truyền thống trong chi tiết ngày.',
  },
]

export function SettingsPanel({ className }: { className?: string }) {
  const { mode, setMode } = useTheme()
  const { settings, update } = useSettings()
  const { usedRemote, isLoading } = useHolidayContext()
  const { user } = useAuth()

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <AccountCard />

      {user ? (
        <>
          <Card>
            <CardHeader title="Danh mục nhật ký" icon={<BookHeart className="size-3.5" />} />
            <div className="px-5 pt-1 pb-5">
              <CategoryManager />
            </div>
          </Card>

          <DataExportCard />
        </>
      ) : null}

      <Card>
        <CardHeader title="Giao diện" icon={<Sun className="size-3.5" />} />
        <div className="px-5 pt-1 pb-5">
          <Segmented
            className="flex w-full"
            options={THEME_OPTIONS}
            value={mode}
            onChange={(next: ThemeMode) => setMode(next)}
            aria-label="Chế độ giao diện"
          />
          <div className="text-subtle mt-3 flex items-center gap-2 text-xs">
            {mode === 'system' ? <Monitor className="size-3.5" /> : mode === 'dark' ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            {mode === 'system' ? 'Theo cài đặt hệ thống của thiết bị.' : 'Luôn dùng chế độ đã chọn.'}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Hiển thị" />
        <div className="flex flex-col px-5 pt-1 pb-4">
          {TOGGLES.map((toggle) => (
            <label
              key={toggle.key}
              className="border-border flex cursor-pointer items-center justify-between gap-4 border-b py-3.5 last:border-b-0"
            >
              <span className="min-w-0">
                <span className="text-text block text-sm font-medium">{toggle.label}</span>
                <span className="text-subtle block text-xs">{toggle.description}</span>
              </span>
              <Switch
                checked={settings[toggle.key]}
                onChange={(value) => update(toggle.key, value)}
                label={toggle.label}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Dữ liệu ngày lễ" />
        <div className="text-muted px-5 pt-1 pb-5 text-sm">
          <p>
            Ngày lễ Âm lịch (Tết, Giỗ Tổ, Trung Thu…) luôn được tính trực tiếp trên máy nên hoạt động
            cả khi ngoại tuyến.
          </p>
          <p className="text-subtle mt-2 text-xs">
            Nguồn bổ sung: date.nager.at ·{' '}
            {isLoading ? 'đang tải…' : usedRemote ? 'đã đồng bộ' : 'đang dùng dữ liệu ngoại tuyến'}
          </p>
        </div>
      </Card>
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6.5 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-surface-3',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-5.5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked && 'translate-x-4.5',
        )}
      />
    </button>
  )
}
