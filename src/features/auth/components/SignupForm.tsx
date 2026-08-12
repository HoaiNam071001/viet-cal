import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signUpWithPassword } from '@/features/auth/services/auth.service'
import { toAuthErrorMessage } from '@/features/auth/types/auth'
import { Button } from '@/shared/components/ui/Button'
import { AuthTextField } from './AuthTextField'
import { GoogleSignInButton } from './GoogleSignInButton'

export function SignupForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Mật khẩu cần tối thiểu 6 ký tự.')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setIsSubmitting(true)
    try {
      const { confirmed } = await signUpWithPassword(email, password, displayName)
      if (confirmed) {
        const from = (location.state as { from?: string } | null)?.from
        navigate(from ?? '/', { replace: true })
      } else {
        setAwaitingConfirmation(true)
      }
    } catch (err) {
      setError(toAuthErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (awaitingConfirmation) {
    return (
      <p className="text-text text-sm">
        Đã gửi email xác nhận đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư và bấm vào liên
        kết để hoàn tất đăng ký.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleSignInButton onError={setError} />

      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-subtle text-xs">hoặc</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <AuthTextField
          label="Tên hiển thị"
          name="displayName"
          autoComplete="name"
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <AuthTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthTextField
          label="Mật khẩu"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AuthTextField
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {error ? <p className="text-primary text-sm">{error}</p> : null}

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </Button>

        <p className="text-muted text-center text-sm">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-primary font-medium">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  )
}
