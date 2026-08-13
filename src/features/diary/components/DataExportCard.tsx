import { Download } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { listAllEntries } from '@/features/diary/services/diary.service'
import { listCategories } from '@/features/diary/services/diary-category.service'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardHeader } from '@/shared/components/ui/Card'

export function DataExportCard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportData = async () => {
    if (!user) return
    setIsExporting(true)
    setError(null)
    try {
      const [entries, categories] = await Promise.all([listAllEntries(user.id), listCategories(user.id)])
      const payload = {
        exportedAt: new Date().toISOString(),
        entries,
        categories,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diary-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('diary.exportFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader title={t('diary.exportTitle')} icon={<Download className="size-3.5" />} />
      <div className="flex flex-col gap-3 px-5 pt-1 pb-5">
        <p className="text-muted text-sm">{t('diary.exportDescription')}</p>
        {error ? <p className="text-primary text-sm">{error}</p> : null}
        <Button variant="secondary" onClick={exportData} disabled={isExporting} className="gap-1.5">
          <Download className="size-4" />
          {isExporting ? t('diary.exporting') : t('diary.exportButton')}
        </Button>
      </div>
    </Card>
  )
}
