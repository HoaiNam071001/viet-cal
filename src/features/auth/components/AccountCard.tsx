import { LogOut, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { signOut } from '@/features/auth/services/auth.service'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardHeader } from '@/shared/components/ui/Card'

export function AccountCard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (isLoading) return null

  if (!user) {
    return (
      <Card>
        <CardHeader title="Tài khoản" icon={<UserIcon className="size-3.5" />} />
        <div className="flex flex-col gap-3 px-5 pt-1 pb-5">
          <p className="text-muted text-sm">Đăng nhập để ghi nhật ký và đồng bộ dữ liệu.</p>
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={() => navigate('/auth/login')}>
              Đăng nhập
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/auth/signup')}>
              Tạo tài khoản
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email

  const onSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Tài khoản" icon={<UserIcon className="size-3.5" />} />
      <div className="flex items-center justify-between gap-3 px-5 pt-1 pb-5">
        <div className="min-w-0">
          <p className="text-text truncate text-sm font-medium">{displayName}</p>
          <p className="text-subtle truncate text-xs">{user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onSignOut} disabled={isSigningOut} className="gap-1.5">
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>
    </Card>
  )
}
