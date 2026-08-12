import { SignupForm } from '@/features/auth/components/SignupForm'
import { Card } from '@/shared/components/ui/Card'

export function SignupPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-text mb-1 text-xl font-semibold">Tạo tài khoản</h1>
      <p className="text-muted mb-5 text-sm">Tạo tài khoản để bắt đầu ghi nhật ký.</p>
      <Card className="p-5">
        <SignupForm />
      </Card>
    </div>
  )
}
