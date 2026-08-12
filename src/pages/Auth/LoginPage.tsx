import { LoginForm } from '@/features/auth/components/LoginForm'
import { Card } from '@/shared/components/ui/Card'

export function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-text mb-1 text-xl font-semibold">Đăng nhập</h1>
      <p className="text-muted mb-5 text-sm">Đăng nhập để ghi và đồng bộ nhật ký của bạn.</p>
      <Card className="p-5">
        <LoginForm />
      </Card>
    </div>
  )
}
