import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/app/config/routes'
import { CategoryManager } from '@/features/diary/components/CategoryManager'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'

export function DiaryCategoriesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.settings)} className="mb-3 -ml-2 gap-1.5">
        <ChevronLeft className="size-4" />
        {t('common.settings')}
      </Button>

      <h1 className="text-text mb-1 text-xl font-semibold">{t('diary.categoriesTitle')}</h1>
      <p className="text-muted mb-5 text-sm">{t('diary.categoriesSubtitle')}</p>

      <Card className="p-5">
        <CategoryManager />
      </Card>
    </div>
  )
}
