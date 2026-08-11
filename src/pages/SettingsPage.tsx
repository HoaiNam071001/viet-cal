import { APP_NAME } from '@/app/config/app.config'
import { SettingsPanel } from '@/features/settings/components/SettingsPanel'

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-text mb-1 text-xl font-semibold">Cài đặt</h1>
      <p className="text-muted mb-5 text-sm">Tùy chỉnh giao diện và thông tin hiển thị.</p>
      <SettingsPanel />
      <p className="text-subtle mt-6 text-center text-xs">
        {APP_NAME} · Âm lịch tính theo múi giờ Asia/Ho_Chi_Minh (UTC+7)
      </p>
    </div>
  )
}
