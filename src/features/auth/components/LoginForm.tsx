import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPassword } from '@/features/auth/services/auth.service'
import { toAuthErrorMessage } from '@/features/auth/types/auth'
import { Button } from '@/shared/components/ui/Button'
import { AuthTextField } from './AuthTextField'
import { GoogleSignInButton } from './GoogleSignInButton'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await signInWithPassword(email, password)
      navigate('/')
    } catch (err) {
      setError(toAuthErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? <p className="text-primary text-sm">{error}</p> : null}

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>

        <p className="text-muted text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/auth/signup" className="text-primary font-medium">
            Tạo tài khoản
          </Link>
        </p>
      </form>
    </div>
  )
}
