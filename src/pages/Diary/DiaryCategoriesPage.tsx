import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CategoryManager } from '@/features/diary/components/CategoryManager'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'

export function DiaryCategoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="mb-3 -ml-2 gap-1.5">
        <ChevronLeft className="size-4" />
        Cài đặt
      </Button>

      <h1 className="text-text mb-1 text-xl font-semibold">Danh mục nhật ký</h1>
      <p className="text-muted mb-5 text-sm">Thêm, sửa hoặc xoá danh mục để phân loại nhật ký.</p>

      <Card className="p-5">
        <CategoryManager />
      </Card>
    </div>
  )
}
